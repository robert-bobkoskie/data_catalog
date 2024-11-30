import React, { Component } from 'react';
import Papa from 'papaparse';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, Highlight } from 'react-vis';
import Draggable from 'react-draggable';
import 'react-vis/dist/style.css';
import './DeltaDashboard.css';

class DataTable extends Component {
  render() {
    const { columns, data } = this.props;
    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((column, j) => (
                <td key={j}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

class DeltaDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      chartData: [],
      hintValue: null,
      selectedRange: null,
      isRangeSelected: false,
      staticTables: false,
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/mock_adi_delta_table_data.csv`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const validData = results.data.filter(row => !isNaN(new Date(row.TIMESTAMP).getTime()));
            this.setState({ data: validData }, () => this.processChartData(validData));
          }
        });
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
  }

  processChartData = (data) => {
    const groupedData = data.reduce((acc, row) => {
      const dateTime = new Date(row.TIMESTAMP).toISOString();
      if (!acc[dateTime]) acc[dateTime] = { added: 0, deleted: 0, modified: 0 };
      acc[dateTime][row.DELTA_ACTION] += 1;
      return acc;
    }, {});

    const chartData = Object.keys(groupedData).map(dateTime => ({
      x: new Date(dateTime),
      y: groupedData[dateTime]
    }));

    this.setState({ chartData });
  }

  handleBrushEnd = (area) => {
    if (area) {
      const { left, right } = area;
      this.setState({ selectedRange: { start: left, end: right }, isRangeSelected: true, staticTables: true });
    }
  }

  handleRightClick = (event) => {
    event.preventDefault();
    this.setState(prevState => ({
      staticTables: !prevState.staticTables,
      selectedRange: prevState.staticTables ? null : prevState.selectedRange,
      isRangeSelected: prevState.staticTables ? false : prevState.isRangeSelected,
      hintValue: prevState.staticTables ? null : prevState.hintValue
    }));
  }

  handlePlotClick = () => {
    if (this.state.staticTables) {
      this.setState({ staticTables: false, selectedRange: null, isRangeSelected: false, hintValue: null });
    }
  }

  getFilteredData = () => {
    const { data, selectedRange, hintValue, isRangeSelected, staticTables } = this.state;

    if (staticTables) {
      if (selectedRange) {
        const { start, end } = selectedRange;
        return data.filter(row => {
          const date = new Date(row.TIMESTAMP);
          return date >= start && date <= end;
        });
      }

      if (hintValue && !isRangeSelected) {
        const dateStr = hintValue.x.toISOString();
        return data.filter(row => new Date(row.TIMESTAMP).toISOString() === dateStr);
      }
    }

    return data;
  }

  formatDate = (date) => {
    return date.toISOString().split('T')[0];
  }

  formatDateTime = (date) => {
    return date.toISOString().replace('T', ' ').replace('.000Z', '');
  }

  getAggregatedCounts = (filteredData) => {
    const aggregatedCounts = filteredData.reduce((acc, row) => {
      if (row.DELTA_ACTION === 'added') acc.added += 1;
      if (row.DELTA_ACTION === 'deleted') acc.deleted += 1;
      if (row.DELTA_ACTION === 'modified') acc.modified += 1;
      return acc;
    }, { added: 0, deleted: 0, modified: 0 });
    return aggregatedCounts;
  }

  render() {
    const { chartData, hintValue, selectedRange, staticTables } = this.state;
    const filteredData = this.getFilteredData();
    const aggregatedCounts = this.getAggregatedCounts(filteredData);

    const columns = [
      { Header: 'TIMESTAMP', accessor: 'TIMESTAMP' },
      { Header: 'DELTA_ACTION', accessor: 'DELTA_ACTION' },
      { Header: 'DIFFERENCES', accessor: 'DIFFERENCES' },
      { Header: 'SERV_ACC_PT_ID', accessor: 'SERV_ACC_PT_ID' },
      { Header: 'ACCOUNT_ID', accessor: 'ACCOUNT_ID' },
      { Header: 'SERVICE_ACCOUNT_ID', accessor: 'SERVICE_ACCOUNT_ID' },
      { Header: 'CUST_ID', accessor: 'CUST_ID' },
      { Header: 'CUST_NAME', accessor: 'CUST_NAME' },
      { Header: 'SITE_ID', accessor: 'SITE_ID' },
      { Header: 'LOC_ID', accessor: 'LOC_ID' },
      { Header: 'ADDRESS', accessor: 'ADDRESS' },
      { Header: 'CITY', accessor: 'CITY' },
      { Header: 'STATE_ABBR', accessor: 'STATE_ABBR' },
      { Header: 'ZIP', accessor: 'ZIP' },
      { Header: 'COUNTRY_NAME', accessor: 'COUNTRY_NAME' },
      { Header: 'BUILDING', accessor: 'BUILDING' },
      { Header: 'ROOM', accessor: 'ROOM' },
      { Header: 'FLOOR', accessor: 'FLOOR' },
      { Header: 'SERV_ID', accessor: 'SERV_ID' },
      { Header: 'PORT_STATE', accessor: 'PORT_STATE' },
      { Header: 'SERV_NAME', accessor: 'SERV_NAME' },
      { Header: 'CKT_ID', accessor: 'CKT_ID' },
      { Header: 'ACC_CKT', accessor: 'ACC_CKT' },
      { Header: 'IOC1', accessor: 'IOC1' },
      { Header: 'MCN', accessor: 'MCN' }
    ];

    const differenceColumns = [
      { Header: 'TIMESTAMP', accessor: 'TIMESTAMP' },
      { Header: 'DIFFERENCES', accessor: 'DIFFERENCES' },
      { Header: 'ACCOUNT_ID', accessor: 'ACCOUNT_ID' },
      { Header: 'SERVICE_ACCOUNT_ID', accessor: 'SERVICE_ACCOUNT_ID' },
      { Header: 'CUST_ID', accessor: 'CUST_ID' },
    ];

    // Filtered data for the differences table
    const filteredDifferences = filteredData.filter(row => row.DIFFERENCES);

    return (
      <div className="page-container">
        <h1>Delta Dashboard</h1>
        {filteredData.length === 0 ? (
          <p>Loading data...</p>
        ) : (
          <div className="content-wrapper">
            <div className="plot-container" onContextMenu={this.handleRightClick} onClick={this.handlePlotClick}>
              <XYPlot xType="time" width={window.innerWidth - 40} height={400} style={{ backgroundColor: '#f0f0f0' }}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title="Time" />
                <YAxis title="Counts" />
                <LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.added }))}
                  curve="curveBasis"
                  color="blue"
                  onNearestX={(value) => {
                    if (!staticTables) {
                      this.setState({ hintValue: value, isRangeSelected: false });
                    }
                  }}
                />
                <LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.deleted }))}
                  curve="curveBasis"
                  color="red"
                  onNearestX={(value) => {
                    if (!staticTables) {
                      this.setState({ hintValue: value, isRangeSelected: false });
                    }
                  }}
                />
                <LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.modified }))}
                  curve="curveBasis"
                  color="green"
                  onNearestX={(value) => {
                    if (!staticTables) {
                      this.setState({ hintValue: value, isRangeSelected: false });
                    }
                  }}
                />
                {hintValue && !this.state.isRangeSelected && (
                  <Draggable>
                    <div className="hint-container draggable">
                      <h4>Date: {this.formatDateTime(hintValue.x)}</h4>
                      <p><span className="legend-key" style={{ backgroundColor: 'blue' }}></span> Added: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.added || 0}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'red' }}></span> Deleted: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.deleted || 0}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'green' }}></span> Modified: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.modified || 0}</p>
                    </div>
                  </Draggable>
                )}
                {selectedRange && (
                  <Draggable>
                    <div className="hint-container draggable">
                      <h4>Range: {this.formatDateTime(selectedRange.start)} - {this.formatDateTime(selectedRange.end)}</h4>
                      <p><span className="legend-key" style={{ backgroundColor: 'blue' }}></span> Added: {aggregatedCounts.added}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'red' }}></span> Deleted: {aggregatedCounts.deleted}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'green' }}></span> Modified: {aggregatedCounts.modified}</p>
                    </div>
                  </Draggable>
                )}
                <Highlight
                  onBrushEnd={this.handleBrushEnd}
                />
              </XYPlot>
            </div>
            {(selectedRange || hintValue) && (
              <div className="aggregated-info">
                {selectedRange && (
                  <>
                    <h2>Data from {this.formatDateTime(selectedRange.start)} to {this.formatDateTime(selectedRange.end)}</h2>
                    <div className="aggregated-counts">
                      <p><span className="legend-key" style={{ backgroundColor: 'blue' }}></span> Added: {aggregatedCounts.added}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'red' }}></span> Deleted: {aggregatedCounts.deleted}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'green' }}></span> Modified: {aggregatedCounts.modified}</p>
                    </div>
                  </>
                )}
                {hintValue && !selectedRange && (
                  <>
                    <h2>Data for {this.formatDateTime(hintValue.x)}</h2>
                    <div className="aggregated-counts">
                      <p><span className="legend-key" style={{ backgroundColor: 'blue' }}></span> Added: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.added || 0}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'red' }}></span> Deleted: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.deleted || 0}</p>
                      <p><span className="legend-key" style={{ backgroundColor: 'green' }}></span> Modified: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.modified || 0}</p>
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="table-container">
              <DataTable
                columns={columns}
                data={filteredData}
              />
            </div>
            <div className="difference-section">
              {selectedRange && (
                <h2>Differences from {this.formatDateTime(selectedRange.start)} to {this.formatDateTime(selectedRange.end)}</h2>
              )}
              {hintValue && !selectedRange && (
                <h2>Differences for {this.formatDateTime(hintValue.x)}</h2>
              )}
              <div className="table-container">
                <DataTable
                  columns={differenceColumns}
                  data={filteredDifferences}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DeltaDashboard;
