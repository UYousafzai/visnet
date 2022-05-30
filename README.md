# Visnet


This code contains a small simulator that allows you to build and observe Ad-Hoc Networks.


## Running and Installation:
- Clone the Repo.
- Go to the cloned repo folder.
- double click ``` particleNet.html ``` to launch the simulator.

## Usage and Current Features
The following are the usage and current features of the simulator.
1. The current network simulator gives you a screenshot of the map of TUK where you can build the network.
2. It allows you to place towers to build a network of ad-hoc towers.
    - Check Place Tower Button.
3. it allows you to place people to observe the connectivity patterns of people with your current network layout.
    - Check Place Tower Button.
4. View the Network Connection with the current set Radius of the individual towers.
    - Check Show Network Button.
    - Can be turned off to remove clutter.
5. Change the individual tower connection radius with the Range Slider.
6. Reset the entire network with a blank canvas by pressing the reset button.
7. Calculate the Connectivity Index by pressing the Calculatte Button.
8. Current Connectivity Index shows you the connectivity index for the current network setting.
9. Current Range shows you the current network tower range.

## Future Features and Improvements

Currently the CI is calculated on the user browser and due to javascript inability to work in parallel async mode if there are tons of towers the CI calculation can take a while and even slow down the animation until the CI is calculated, I am developing a flask web application based on this which would allow us to send an API request to the web application to calculate the CI while the animation runs flawlessly in the browser, we can also have time based automatic CI update as well. all of this application will be put behind a login inside the flask application and then put online for use for the purpose of DISCO Seminar.
