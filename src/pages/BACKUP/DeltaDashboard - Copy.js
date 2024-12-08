import React, { Component } from 'react';
import Papa from 'papaparse';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, Hint, Highlight } from 'react-vis';
import 'react-vis/dist/style.css';
import './DeltaDashboard.css';

class DataTable extends Component {
  render() {
    const { columns, data } = this.props;
    return (
      <table className="data-table"><thead><tr>
            {columns.map((column, i) => (
              <th key={i}>{column.Header}</th>
            ))}
          </tr></thead><tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((column, j) => (
                <td key={j}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody></table>
    );
  }
}

class Delta_Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      chartData: [],
      hintValue: null,
      selectedRange: null,
      isRangeSelected: false,
    };
  }

  componentDidMount() {
    fetch('/mock_adi_delta_table_data.csv')
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
      this.setState({ selectedRange: { start: left, end: right }, hintValue: null, isRangeSelected: true });
    } else {
      this.setState({ selectedRange: null, isRangeSelected: false });
    }
  }

  getFilteredData = () => {
    const { data, selectedRange, hintValue, isRangeSelected } = this.state;

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
    const { chartData, hintValue, selectedRange } = this.state;
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
      <div className="page-container"><h1>Delta Dashboard</h1>
        {filteredData.length === 0 ? (
          <p>Loading data...</p>
        ) : (
          <div className="content-wrapper"><div className="plot-container"><XYPlot xType="time" width={window.innerWidth - 40} height={400}><VerticalGridLines /><HorizontalGridLines /><XAxis title="Time" /><YAxis title="Counts" /><LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.added }))}
                  curve="curveBasis"
                  onNearestX={(value) => this.setState({ hintValue: value, isRangeSelected: false })}
                /><LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.deleted }))}
                  curve="curveBasis"
                  onNearestX={(value) => this.setState({ hintValue: value, isRangeSelected: false })}
                /><LineSeries
                  data={chartData.map(d => ({ x: d.x, y: d.y.modified }))}
                  curve="curveBasis"
                  onNearestX={(value) => this.setState({ hintValue: value, isRangeSelected: false })}
                />
                {hintValue && !this.state.isRangeSelected && (
                  <Hint value={hintValue}><div className="hint-container"><h4>Date: {this.formatDateTime(hintValue.x)}</h4><p>Added: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.added || 0}</p><p>Deleted: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.deleted || 0}</p><p>Modified: {chartData.find(d => d.x.getTime() === hintValue.x.getTime())?.y.modified || 0}</p></div></Hint>
                )}
                <Highlight
                  onBrushEnd={this.handleBrushEnd}
                  onDragEnd={this.handleBrushEnd}
                /></XYPlot></div>
            {(selectedRange || hintValue) && (
              <><div className="table-container">
                  {selectedRange && (
                    <><h2>Data from {this.formatDateTime(selectedRange.start)} to {this.formatDateTime(selectedRange.end)}</h2><div className="aggregated-counts"><p>Added: {aggregatedCounts.added}</p><p>Deleted: {aggregatedCounts.deleted}</p><p>Modified: {aggregatedCounts.modified}</p></div></>
                  )}
                  {hintValue && !selectedRange && (
                    <h2>Data for {this.formatDateTime(hintValue.x)}</h2>
                  )}
                  <DataTable
                    columns={columns}
                    data={filteredData}
                  /></div><div className="difference-section">
                  {selectedRange && (
                    <h2>Differences from {this.formatDateTime(selectedRange.start)} to {this.formatDateTime(selectedRange.end)}</h2>
                  )}
                  {hintValue && !selectedRange && (
                    <h2>Differences for {this.formatDateTime(hintValue.x)}</h2>
                  )}
                  <div className="table-container"><DataTable
                      columns={differenceColumns}
                      data={filteredDifferences}
                    /></div></div></>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Delta_Dashboard;
