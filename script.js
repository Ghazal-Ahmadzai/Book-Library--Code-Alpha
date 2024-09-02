document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const sections = document.querySelectorAll('section');
    const borrowForm = document.getElementById('borrow-form');
    const borrowingHistory = document.getElementById('borrowing-history');
    const historyList = document.getElementById('history-list');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        sections.forEach(section => {
            const books = section.querySelectorAll('.book');
            let sectionVisible = false;

            books.forEach(book => {
                const bookTitle = book.querySelector('p').textContent.toLowerCase();
                if (bookTitle.includes(query)) {
                    book.style.display = 'block'; 
                    sectionVisible = true;
                } else {
                    book.style.display = 'none'; 
                }
            });

            section.style.display = sectionVisible ? 'block' : 'none';
            section.querySelector('.section-title').style.display = sectionVisible ? 'block' : 'none';
        });
    });

    borrowForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('borrow-email').value;
        const name = document.getElementById('borrow-name').value;
        const bookTitle = document.getElementById('borrow-book').value;
        const dueDate = document.getElementById('due-date').value;

        if (!email || !name || !bookTitle || !dueDate) {
            alert('Please fill out all fields in the form.');
            return;
        }

        const newHistoryItem = document.createElement('li');
        newHistoryItem.innerHTML = `${name} borrowed "<strong>${bookTitle}</strong>" Email: <strong>${email}</strong>. Due Date: <span class="due-date">${new Date(dueDate).toLocaleDateString()}</span>`;
        newHistoryItem.dataset.bookTitle = bookTitle; // Store bookTitle in data attribute
        historyList.appendChild(newHistoryItem);

        borrowingHistory.style.display = 'block';
        updateBorrowButtons(bookTitle);
        borrowForm.reset();
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('borrow-button') || event.target.classList.contains('return')) {
            const button = event.target;
            const bookTitle = button.closest('.book').querySelector('p').textContent;

            if (button.classList.contains('borrow-button')) {
                if (borrowForm.checkValidity()) {
                    borrowBook(button, bookTitle);
                } else {
                    alert('Please fill out the form to borrow this book.');
                }
            } else if (button.classList.contains('return')) {
                if (confirm(`Do you want to return "${bookTitle}"?`)) {
                    returnBook(button, bookTitle);
                }
            }
        }
    });

    function borrowBook(button, bookTitle) {
        console.log('Book borrowed:', bookTitle);
        button.textContent = 'Return';
        button.classList.remove('borrow-button');
        button.classList.add('return');
        button.style.backgroundColor = 'gray'; 
        button.dataset.borrowed = 'true';
    }

    function returnBook(button, bookTitle) {
        console.log('Book returned:', bookTitle);
        button.textContent = 'Borrow';
        button.classList.remove('return');
        button.classList.add('borrow-button');
        button.style.backgroundColor = '#FFBF00'; 
        button.dataset.borrowed = 'false';
        
        // Remove the book's entry from the borrowing history
        const historyItems = historyList.querySelectorAll('li');
        historyItems.forEach(item => {
            if (item.dataset.bookTitle === bookTitle) {
                historyList.removeChild(item);
            }
        });

        // Display notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${button.closest('.book').querySelector('p').textContent} has been returned.`;
        document.body.appendChild(notification);
        
        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    function updateBorrowButtons(borrowedTitle) {
        const borrowButtons = document.querySelectorAll('.borrow-button, .return');

        borrowButtons.forEach(button => {
            const bookTitle = button.closest('.book').querySelector('p').textContent;
            if (bookTitle === borrowedTitle) {
                borrowBook(button, bookTitle);
            }
        });
    }

    const bookDropdown = document.getElementById('borrow-book');
    const bookElements = document.querySelectorAll('.book p');
    const books = [];

    bookElements.forEach(bookElement => {
        books.push(bookElement.textContent);
    });

    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookDropdown.appendChild(option);
    });
});