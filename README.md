# Projexion webui

Proje Xion WebUI is a modern frontend interface designed to interact with a backend system. It provides a modular and intuitive dashboard for managing infrastructure components such as Project, User, Firma and more





## Installation Instructions


**Step 1:**  

Download node modules using following command:
```
npm install
```

**Step 2:**  
Run ui using following command:

```
npm start
```
The application will start on http://localhost:3000/

## Features of UI Modules

The interface includes some the following key components:

* Dashboard:	Overview of system status and key metrics


## Note
Dialog must close with closeAfterTransition={true} and disableRestoreFocus  to avoide console error.
As an Example:
```
<Dialog
<Dialog
open={isAddRoleDialogOpen}
onClose={closeAddRoleDialog}
closeAfterTransition={true}
disableRestoreFocus
fullWidth>
/>
```



