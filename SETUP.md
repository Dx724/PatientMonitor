# Alarm Monitoring System

Setup instructions for the Raspberry Pi web server for Alarm Monitoring System.

## Introduction

The Raspberry Pi that is marked #2 and has no microphone plugged in is the web server. It has to be connected to the hospital wifi in order to communicate with the rest of the system.
The RPi has nano installed for text editing through the command line. You can access the RPi by either connecting it to a computer with USB, and then ``ssh pi@raspberrypi.local``, with password ``raspberry`` Alternatively, you can connect it to a monitor, mouse and keyboard.
It already has npm and all required modules installed, along with the actual website code, located in the ~/PatientMonitor directory. On start up, the RPi starts the web server on port 8080.

## Adding Raspberry Pi streams

The PatientMonitor/src directory contains a file named streamInfo.json, which contains the room and stream information.
It currently contains an example template, filled with test links. The format of the file is as follows:

``` JSON
{
    "rooms": [
        {
            "identifier": "<roomName1>",
            "streams": [
                {
                    "name": "<streamName1>",
                    "streamLink": "http://<RPi_IP_Address_1>/livemic"
                },
                {
                    "name": "<streamName2>",
                    "streamLink": "http://<RPi_IP_Address_2>/livemic"
                },
                ... rest of streams in room
            ]
        },
        ... rest of rooms
    ]
}
```

In order to make the Alarm Monitoring System work, you need to edit this file with the corresponding information for your system. You can edit with nano in the command line, and save with Ctrl+X. Make sure that ***EACH ROOM NAME IS UNIQUE*** and that ***EACH STREAM NAME IS ALSO UNIQUE***. All names should be surrounded by quotes. Straying from these guidelines will cause the streams in question not to play.

We recommend naming each room after its number (``roomX``), and naming each stream after the room and a unique identifier, (``roomX_streamY``). Please keep the identifiers **below 25 characters**.

 After editing the streamInfo.json file, cd back to the ~/PatientMonitor directory, and run ``npm run build``. This recompiles the production version of the website. After it compiles, you can access the website from the IP address of the web server on port 8080. The IP address can be found by ``ifconfig`` in the command line of the RPi.

 In order to access the website on a client, the latest version of **Firefox** is heavily recommended. Google Chrome also works, but is slightly less compatible. Do **not** use Safari. Unfortunately, the mobile version of the website is not yet fully supported - audio will play, but none of the advanced features are available.

### Troubleshooting

 If for some reason the website doesn't update the list of available rooms after recompiling the production build, clear the cache of the web browser that you're using. If that doesn't work, restart the RPi as well, which forces the HTTP-Server to restart.
 