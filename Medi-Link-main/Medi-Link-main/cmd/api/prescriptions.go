package main

import (
	"lp3/internal/data"
	"net/http"
	"text/template"

	"github.com/gorilla/mux"
)

// Gets distinct prescription categories and displays them as folders
func (app *application) prescriptionHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := app.getUserFromCookie(r)

	categories, err := app.model.Fm.GetCategoriesByUser(user.Id, data.PRESCRIPTION)
	if err != nil {
		app.logger.Printf("Unable to retrieve cateogires from User: %v\n", err)
		return
	}

	tmpl, err := template.ParseFiles("templates/categories.html")
	if err != nil {
		app.logger.Printf("Unable to locate cateogires.html: %v\n", err)
		return
	}

	tmpl.Execute(w, categories)
}

// Gets files within the specific category and lists them
func (app *application) categoryHandler(w http.ResponseWriter, r *http.Request) {
	cat := mux.Vars(r)["cat"]
	user, _ := app.getUserFromCookie(r)

	files, err := app.model.Fm.GetUserFilesByCategory(user.Id, cat, data.PRESCRIPTION)
	if err != nil {
		app.logger.Printf("Unable to get Files from category: %s, %v\n", cat, err)
		return
	}

	tmpl, err := template.ParseFiles("templates/files.html")
	if err != nil {
		app.logger.Printf("Unable to locate files.html: %v\n", err)
		return
	}

	tmpl.Execute(w, files)
}

// Handles File uploads and saves it to uploads directory
// TODO: make it more generic for uploading scans/reports
// TODO: a closure wherein the file type is set
func (app *application) prescriptionUploadHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := app.getUserFromCookie(r)

	if r.Method == "GET" {
		tmpl, err := template.ParseFiles("templates/form.html")
		if err != nil {
			app.logger.Printf("Unable to locate form template: %v\n", err)
			return
		}

		tmpl.Execute(w, nil)
	} else {

		if err := r.ParseMultipartForm(32 << 20); err != nil {
			app.logger.Printf("Unable to parse multipart form: %v\n", err)
			return
		}

		files := r.MultipartForm.File["prescription"]
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				app.logger.Printf("Unable to Open File from Header: %v\n", err)
				return
			}
			defer file.Close()

			// Creates a file with uuid and inserts it to database
			f := data.NewFile(file, fileHeader, r.FormValue("category"), user.Id, data.PRESCRIPTION)
			app.model.Fm.Insert(f)

			// Create a destination folder as uuid.gz in the uploads directory
			err = app.zip(f.Name, file)
			if err != nil {
				app.logger.Printf("Unable to zip file: %s, %v\n", err.Error(), err)
				return
			}
		}

		http.Redirect(w, r, "../", http.StatusFound)
	}
}
