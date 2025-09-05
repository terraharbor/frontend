<h1 align="center" style="margin-top: 0px;">frontend</h1>

<p align="center">Frontend of the TerraHarbor application built with React, TypeScript and Vite</p>

<div align="center">

<a href="https://github.com/terraharbor/frontend/releases"><img alt="Release" src="https://img.shields.io/github/v/release/terraharbor/frontend?sort=semver&style=for-the-badge&label=Release"></a>
<a href="https://github.com/terraharbor/frontend?tab=GPL-3.0-1-ov-file#readme"><img alt="License" src="https://img.shields.io/github/license/terraharbor/frontend?style=for-the-badge&logo=gplv3&label=License"></a>
<a href="https://github.com/terraharbor/frontend/actions/workflows/docker-build.yaml?query=event%3Apush"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/terraharbor/frontend/docker-build.yaml?event=push&style=for-the-badge&logo=docker&label=Build"></a>

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [📖 Description](#-description)
- [🎨 Mockups](#-mockups)
- [🛠️ Technical stack](#️-technical-stack)
- [🚀 Useful commands](#-useful-commands)

## 📖 Description

This repository contains the code for the user interface to manage Terraform states through the TerraHarbor backend.

## 🎨 Mockups

The mockups are available on [Figma](https://www.figma.com/design/c1RcExI2NRHv09lbvCO9E9/Project-design?node-id=1-7&p=f&t=ZPNJ1nykRV9viM3P-0).

## 🛠️ Technical stack

- [Vite](https://vitejs.dev/) (React + TS)
- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- ESLint + Prettier (code quality)

## 🚀 Useful commands

```bash
# 1. Install the dependencies
npm install

# 2. Run the app locally
npm run dev

# 3. Apply linter
npm run lint

# 4. Verify typing
npm run typecheck

# 5. Format the whole repo
npm run format

# 6. Build for prod
npm run build

# 7. Preview the prod app
npm run preview
```
