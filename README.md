<p align="center"><img src="https://user-images.githubusercontent.com/42010884/117746104-b39a4080-b1c0-11eb-98cd-ef882efc341d.png" alt="Curb-It-Logo"></p>

The mobile-first web app lets people posts their recyclables online and other volunteers on the application can come and pick them up. [Link to the official website](https://team-35-ddc6a.web.app/).


Our [Facebook Page](https://www.facebook.com/Curb-It-103446931950880), like and share our page to help us grow!  
Take a look at our public [Trello Board](https://trello.com/b/4UzTkjaW/curb-it) 
## Table of Contents
- [Table of Contents](#table-of-contents)
- [Contributors](#contributors)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Development](#development)
- [Bugs/Issues](#bugsissues)
- [Directory Structure](#directory-structure)
- [Easter Eggs](#easter-eggs)
## Contributors
To learn more about the team that developed this project, click [here](https://team-35-ddc6a.web.app/about.html).
- [Tony Trinh](https://github.com/tonytrinh19)
- Marco Duval
- Xandra Nguyen
- Maximus Joe
- Paul Kim

## Features
- Post request for pickup recyclables
- Filter system, sort by city name, size, posted date
- Real-time messaging between volunteer and request poster
- Live notifications for messages, request accepted, and request fulfilled
- Live status tracking for both accepted requests and requests posted per user
- Much More!
## Technologies

Technologies used for this project:
- HTML, CSS, & JavaScript
- JQuery v3.6.0
- Bootstrap v5.0 (Front-end framework)
- Firebase v8.5.0 (Hosting)
- Firestore v8.4.3 (Database)
- Figma (prototype & design)
- Trello (agile project management)
- Visual Studio code v1.53.2

## Installation
To run the test file <b>Curb-It tests.side</b>, visit https://www.selenium.dev/ to learn how to add Selenium IDE plugin to your browser and how to run it. 
Download Visual Studio code at https://code.visualstudio.com/Download and download depending on your device.
For deploying Firebase, go to https://firebase.google.com/docs/cli?authuser=0#install-cli-windows and download the correct one depending on your device.

## Development
Want to contribute and help us grow? Perfect!

To fix a bug or enhance an existing module or add a new feature, follow the following steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made (`git add .`)
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request
## Bugs/Issues
If you notice bugs on the website, feel free to contact us directly by sending us messages on Facebook or open an issue [here](https://github.com/maximusjoe/COMP-2800-Team-BBY-35-Curb-It/issues). Please include sample queries and corresponding information.
## Directory Structure
Details of what each file does, files that are left blank are pretty self-explanatory  
📦public : The directory that the project lives in    
 ┣ 📜Curb-It tests.side : Test cases for automation testing using Selenium IDE  
 ┣ 📂img : I don't want to bore you with all the images descriptions  
 ┣ 📂scripts  
 ┃ ┣ 📜authentication_check.js : Checks whether the user is logged in, contains a listener to notifications collection on Firestore     
 ┃ ┣ 📜firebase_api.js : Contains the app keys and firebase related keys   
 ┃ ┣ 📜login.js  
 ┃ ┣ 📜main.js  : Sorting system  
 ┃ ┣ 📜notifications.js  
 ┃ ┣ 📜post_success.js    
 ┃ ┣ 📜profile.js  
 ┃ ┣ 📜real-time.js  
 ┃ ┣ 📜request-edit.js  
 ┃ ┣ 📜request-form.js  
 ┃ ┣ 📜request-info.js  
 ┃ ┗ 📜snake.js  
 ┣ 📂sound  
 ┃ ┣ 📂audio: Contains audio files for the app     
 ┣ 📂styles : Styling folder for our pages     
 ┣ 📜404.html :  404 page that tells users that they have accessed the wrong link, with a twist  
 ┣ 📜about.html : A brief look at our mission and the team who helped develop the website  
 ┣ 📜Editprofile.html : Edit profile page  
 ┣ 📜help.html  : Help page  
 ┣ 📜index.html  : Login page  
 ┣ 📜main.html  : Main page  
 ┣ 📜notification.html : Notification page   
 ┣ 📜postSuccess.html  : The page after user successfully posted a request    
 ┣ 📜profile.html  : User profile page contains personal info & posts tracking system  
 ┣ 📜real-time-messaging.html : Chat page    
 ┣ 📜request-edit.html  : Edit request page  
 ┣ 📜request-info.html  : Request details information  
 ┣ 📜request_form.html  : Page that users use to enter their request details   
 ┣ 📜settings.html  : Page to change personal info  
 ┗ 📜snakeEasterEgg.html  : Snake game easter egg

 ## Easter Eggs

 To activate one of our easter egg:
 1. Go to our [website](https://team-35-ddc6a.web.app/) on the login page 
 2. Click the Curb-It logo 3 times  
   
![1](https://user-images.githubusercontent.com/42010884/119929425-53322f80-bf32-11eb-9560-d8069f63452f.PNG)  

 3. Click the button that has just appeared  

![2](https://user-images.githubusercontent.com/42010884/119929430-54635c80-bf32-11eb-8732-fbd6803a9ac1.PNG)

 4. Voila! It will then redirects you to our mini fun garbage-collecting snake game! Collect as many points as possible and share it with us! You can directly access our snake game easter egg [here](https://team-35-ddc6a.web.app/snakeEasterEgg.html)
   
![3](https://user-images.githubusercontent.com/42010884/119929432-55948980-bf32-11eb-863a-dfe676e83465.PNG)

We also have another little surprise when users get lost on our app. The 404 page has been changed to [this](https://team-35-ddc6a.web.app/hello.html)
