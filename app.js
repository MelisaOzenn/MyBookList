//We have three classes; Book, UI and Store

//Book Class
class Book{
    constructor(title, author, isbn){
        this.title= title;
        this.author= author;
        this.isbn= isbn;
    }
}

//UI Class
class UI{
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book)=>UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr'); //creating a table
        row.innerHTML = `        
        <td>${book.title}</td>  
        <td>${book.author}</td>
        <td>${book.isbn}</td>  
        <td><a href="#" class= "bt btn-danger btn-sm
        delete">X</a></td>      
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div'); //creating div
        div.className = `alert alert-${className}`; //add class, about what type of alert it is
        div.appendChild(document.createTextNode(message)); //add text
        const container = document.querySelector('.container');
        const form= document.querySelector('#book-form');
        container.insertBefore(div, form); //insert div before form
        //we have created form beforehand
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);//show only 3 sec

    }
    
    static clearFields(){
        //select query and equal value to empty
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}


//Store Class
class Store{
    static getBooks(){
        /*create books
        get books from local storage, JSON.parse
        return books*/
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        /*get books from storage and put into const books
        push book into books*/
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn){
        /*get books from storage and put into const books
        for each book, check the isbn
        when isbn is equal, splic(remove) it.
        */
        const books = Store.getBooks();
        books.forEach((book,index) =>{
            if(book.isbn === isbn){
                books.splice(index, 1); //remove only 1 content 
            }
        });

        localStorage.setItem('books', JSON.stringify(books));//??????
    }
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event: Add a Book, both UI and Store
document.querySelector('#book-form').addEventListener('submit', 
(e) => {
    e.preventDefault();
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    
    if(title==='' || author ==='' || isbn===''){
        UI.showAlert("Please fill in all areas", 'danger');
    }
    else{
    const book = new Book(title, author, isbn);//instantiate book    
    UI.addBookToList(book);//add book to ui
    Store.addBook(book); //storage
    UI.showAlert('Book Added', 'success'); //alert
    UI.clearFields();//clear area
    }

});


//Event: Remove a Book, both UI and store
document.querySelector('#book-list').addEventListener('click', 
(e)=> {
    UI.deleteBook(e.target);
    UI.showAlert('Book Removed', 'success');
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //remove whole content from local storage
});