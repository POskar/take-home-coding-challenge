# Real Estate Sensor Data Platform Backend Coding Challenge

Please organize, design, test, and document your code as if it were going into production.

## Challenge Description

**_Write a program that can process and store real estate sensor data from multiple rooms and efficiently query and aggregated data over different time periods, measurement types, and resolutions._**

Use the mock data in the [data.json](data.json) file in this repository. Below is an example of the data:

| Datetime             | Room   | Measurement | Value |
| -------------------- | ------ | ----------- | ----- |
| 2022-08-23T23:05:12T | Room A | Temperature | 22.8  |
| 2022-08-25T17:04:41T | Room B | CO2         | 318.0 |
| 2022-08-29T18:11:14T | Room B | Occupancy   | 1.0   |

The program should have two main endpoints:

1. An endpoint to store the sensor data, handling data coming in from sensors. Use the JSON format in [data.json](data.json) as a guideline for how the incoming data might be structured. **NB: Make sure you handle data coming in from different time zones!**
2. An endpoint to query data with parameters for start and end times, measurement type, room, and time resolution (raw, hourly, daily, weekly), returning the queried data in a JSON format. Each parameter should be optional to provide for the user. (The default value for resolution is "raw"). If the resolution is not set to "raw," then you need to find the average value of all the values that fall within a time bucket of the chosen resolution. For example, if the hourly resolution is chosen, you should average all the values that occur within a specific hour.

## Requirements

1. Any language of your choice, however we prefer Javascript so using Javascript will make our review better.
2. Well documented with comments as if it would be production ready.
3. Use pre-defined Design Patterns whenever needed in your code.
4. Input and output should be via a simple REST API.
5. Write your README as if it was for a production service. Include the following items:
   - Description of the problem and solution.
   - Whether the solution focuses on back-end, front-end or if it's full stack.
   - Reasoning behind your technical choices, including architectural.
   - Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the project.

## Expected Deliverables

1. Hosted repository for the program, link to it (e.g. Github, Bitbucket, etc.).
2. Code should be well structured, suitably commented, have error handling, and be tested.
3. README file, where you describe your solution (design and architecture), how to run the program. You can use pseudo-code here.

## How will we review?

[Guidelines can be found here](README.md)

## Frequently asked questions

**Q: I have a more robust background in other languages than Javascript. Can I use it to complete the task?**

A: Yes, although the task endorses Javascript as a requirement, we still believe that the best engineers are language agnostic. Javascript reflects the primary language in our stack, which you'll be using daily.

**Q: Can I use framework X to implement the task, use external libraries/dependencies, or shall I write the code in plain Javascript?**

A: Use any library or framework of your choice. If a framework or library is used, we expect you to be able to answer why and what that framework/library does for your application (no need to comment or write about this, but we might ask in a follow-up chat).

**Q: I currently work at a full-time job/Is there a deadline to deliver it?**

A: Although there's NO deadline, we endorse having you take a good look at the task; send us back your best estimate of delivery, which can show us your commitment level without putting any pressure on your schedules. Most candidates deliver within a few days.
