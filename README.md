# Spacebook

## Description

A Facebook clone made in React Native, using a [RESTful API](https://github.com/oliverroyknox/spacebook-api) as a backend. This project is my coursework submission for **Mobile App Development** 2021.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the application

   ```bash
   npm start
   ```

3. Only for running in emulator.

   Change the config at `/config/server.config.json` to point to the Android emulator's host machine address `10.0.2.2`.

## Style Guide

The [Airbnb Style Guide](https://github.com/airbnb/javascript) with a basic prettier config is used to enforce code style.

## Background Tasks

This application uses the [Background Fetch API](https://docs.expo.dev/versions/latest/sdk/background-fetch/) to schedule when a draft should be posted, whilst the application is in the background. It does so by adding any drafts to persistent storage and coupling them with a timestamp (set within the application's UI). Then the background task will check storage to see if any drafts are due to be posted and perform the necessary actions to do so, if that is the case. **NOTE: this functionality is only supported on Android and iOS platforms as it interfaces with native API's that are not currently available on the web.**

**Some depedencies are not fully supported in a web view and for the best experience I recommended running the application in an Android emulator.**

## Repository

This repository can be found on GitHub [here](https://github.com/oliverroyknox/spacebook).
