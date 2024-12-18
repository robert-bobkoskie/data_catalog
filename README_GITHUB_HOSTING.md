# Using a Separate Branch for GitHub Pages Deployment

Using a separate branch for deploying your GitHub Pages site, such as `gh-pages`, is a common and effective practice. Here are some advantages and steps to do so:

## Advantages of Using a Separate Branch

- **Separation of Concerns**: Keeping the deployment branch separate from your main development branch allows you to manage your source code and deployment files independently.
- **Clean Main Branch**: Your main branch remains clean and focused on the source code, while the `gh-pages` branch can contain only the files necessary for deployment.
- **Ease of Updates**: Updating your site becomes easier as you only need to merge changes to the `gh-pages` branch when you're ready to deploy.

## Steps to Create and Deploy from a Separate Branch

### Create the `gh-pages` Branch:

Create the `gh-pages` branch from your `main` branch:

```bash
git checkout main
git pull origin main
git checkout -b gh-pages
git push origin gh-pages
