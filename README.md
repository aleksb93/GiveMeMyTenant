# GiveMeMyTenant
 This is a browser extension that helps with switching tenants in *.microsoft.com portals. This does not work with Azure, as it handles tenant information differently.

## Installation
 Download extention from [Releases](https://github.com/aleksb93/GiveMeMyTenant/releases). 

 For FireFox: Donwload "GiveMeMyTenant.xpi" and allow it to install. \
 For Chrome (and Chrome variants):
 1. Download GiveMeMyTenant.xpi
 2. Unzip the content to a folder (it's a compressed folder)
 3. Open Chrome, and go to chrome://extensions/
 4. In top right, enable developer mode
 5. Select "Load unpacked" and choose the folder of the unpacked extension

 ## Is this you?
 You are working in one of your customers tenants, and when you are done you switch over to the next customer with the "switch tenant button": \
 <img src="./images/microsoft_switch_button.png" alt="Microsoft Switch button" width="400" />
\
 You continue working, but now when you want to change tenant, the button has disappeared! \
 <img src="./images/where_button.png" alt="Where button" width="400" />
\
Leaving you like: \
<img src="./images/i_dunno.jpg" alt="I dunno" width="300" />
\
 So until the small, indie company, Microsoft has the capacity to fix this bug you can use the "GiveMeMyTenant"-extention!

 ## The Extension
 <img src="./images/GiveMeMyTenant.png" alt="GiveMeMyTenant img" />

 This is a small extension, with the only purpose of changing the current tenant ID (TID).
 All data is stored locally in the browser, and will persist between reboots. Deleting all browser data might delete saved TIDs.
 It works on any *.microsoft.com that uses TIDs in URL, and can even switch tenants while you are in submenus in the portal.