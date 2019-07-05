// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id,amount,currency,category,date) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.category = category;
        this.date = date;
    }

    // Data Structure
    const data = {
        items: [],
        currentItem: null,
    }

    // Public Methods
    return {
        addItem: function(amount,currency,category,date) {
            
            // Create ID
            let ID;
            if(data.items.length > 0){
              ID = data.items[data.items.length - 1].id + 1;
            } else {
              ID = 0;
            }

            // Create new item
            newItem = new Item(ID,amount,currency,category,date)

            // Add item to data array
            data.items.push(newItem);

            // Return new item
            return newItem;
        },
        deleteItem: function(itemID) {

            // Remove item from data array
            data.items.splice(itemID,1)
            
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function(itemID) {
            currentItem = (data.items[itemID]);
            return currentItem;
        },
        updateItem: function(amount, currency, category, date) {
            
            let found = null;
            data.items.forEach(function(item){
                if(item.id == data.currentItem.id){
                    item.amount = amount;
                    item.currency = currency;
                    item.category = category;
                    item.date = date;
                    found = item;
                }})  
            return found;
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(function(item){
                if (item.id == id){
                    found = item;
                }
            });
            return found;
        },
        logData: function() {
            return data;
        }
    }

})();

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        deleteBtn: '.delete-btn',
        itemList: '#item-list',
        itemAmountInput: '#amount',
        itemCurrencyInput: '#currency',
        itemCategoryInput: '#category',
        itemDateInput: '#date',
        itemDelete: '.item-delete',
        listItems: '#item-list li'
    }

    // Public methods
    return {
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                amount:document.querySelector(UISelectors.itemAmountInput).value,
                currency:document.querySelector(UISelectors.itemCurrencyInput).value,
                category:document.querySelector(UISelectors.itemCategoryInput).value,
                date:new Date(document.querySelector(UISelectors.itemDateInput).value),
            }
        },
        addListItem: function(item) {
            // Create a div
            const li = document.createElement('li');
            // Add class
            li.className = 'list-group-item';
            // Add ID
            li.id = item.id;
            // Add HTML
            li.innerHTML = `
                <strong>Amount: </strong> <em>${item.amount}</em></br>
                <strong>Currency: </strong> <em>${item.currency}</em></br>
                <strong>Category: </strong> <em>${item.category}</em></br>
                <strong>Date: </strong> <em>${item.date}</em></br>
                <a href="#" class="card-link item-edit">Edit item</a>
                <a href="#" class="card-link item-delete">Delete item</a>
            `;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        deleteListItem: function(item) {
            item.remove();
        },
        showEditState: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        },
        addItemToForm: function(currentItem) {

            // Format date   
            var itemDate = currentItem.date;
            var dateFormat = function dateFormat(itemDate) {
                var d = new Date(currentItem.date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
            
                return [year, month, day].join('-');
                };

            // Populate fields
            document.querySelector(UISelectors.itemAmountInput).value = currentItem.amount;
            document.querySelector(UISelectors.itemCurrencyInput).value = currentItem.currency;
            document.querySelector(UISelectors.itemCategoryInput).value = currentItem.category;
            document.querySelector(UISelectors.itemDateInput).value = dateFormat();

            // Enable edit state
            UICtrl.showEditState();
        },
        updateListItem: function(item) {

            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // Turn Node list into array
            listItems = Array.from(listItems);

            console.log('start working here');

        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemAmountInput).value = '';
            document.querySelector(UISelectors.itemCurrencyInput).value = 'Choose...';
            document.querySelector(UISelectors.itemCategoryInput).value = 'Choose...';
            document.querySelector(UISelectors.itemDateInput).value = '';
        }
    }
})();

// App Controller
const App = (function(ItemCtrl,UICtrl) {

    // Load event listeners
    const loadEventListeners = function() {

        // Get UI selectors
        UISelectors = UICtrl.getSelectors();

        // Add item event
        document.getElementById('spend-form').addEventListener('submit', itemAddSubmit);

        // Delete / edit item event
        document.querySelector('ul').addEventListener('click', itemLinkClick);

        // Back button event (from edit state)
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Delete item event (from edit state)
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItemEditState);

        // Update item event (from edit state)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItemEditState);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        
        // Get form input from UI controller
        const input = UICtrl.getItemInput();

        // Check user submitted all fields
        if (input.amount !== '' && input.currency !== '' && input.category !== '' && input.date !== '') {

            // Add item
            const newItem = ItemCtrl.addItem(input.amount, input.currency, input.category, input.date);

            // Add item to UI
            UICtrl.addListItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // Delete / edit item
    const itemLinkClick = function(e) {

        var itemClicked = e.target;

        // Delete item
        if (itemClicked.classList.contains("item-delete")) {

            // Delete item from data structure
            ItemCtrl.deleteItem(itemClicked.parentNode.id);

            // Delete item from UI
            UICtrl.deleteListItem(itemClicked.parentNode);

            // Edit item
            } else if (itemClicked.classList.contains("item-edit")) {

                // Get item ID
                let id = itemClicked.parentNode.id;

                // Get item
                const itemToEdit = ItemCtrl.getItemById(id);

                // Set current item
                ItemCtrl.setCurrentItem(itemToEdit);

                // Get item from data array
                // let currentItem = ItemCtrl.getCurrentItem(itemToEdit);

                //Populate fields
                UICtrl.addItemToForm(itemToEdit);

            } 
    }

    // Delete item (from edit state)
    const deleteItemEditState = function(e) {

        var itemClicked = e.target;

        if (itemClicked.classList.contains("delete-edit-state")) {

            // Get item ID
            const itemID = ItemCtrl.logData();

            // Delete item from data structure
            ItemCtrl.deleteItem(itemID.currentItem);

            // Get item from UI
            let item = document.querySelector('ul');
            let itemListNumber = parseInt(itemID.currentItem) + 1;            
            let listItem = item.childNodes[itemListNumber];

            // Delete item from UI
            UICtrl.deleteListItem(listItem);

            // Clear fields
            UICtrl.clearEditState();

        }
    }

    // Update item (from edit state)
    const updateItemEditState = function(e) {
        
        // Get form input from UI controller
        const input = UICtrl.getItemInput();

       // Update item
       const updatedItem = ItemCtrl.updateItem(input.amount, input.currency, input.category, input.date);

       // Update UI
       UICtrl.updateListItem(updatedItem);

    }

    // Public methods
    return {
        init: function() {

            // Clear edit state / set initial set
            UICtrl.clearEditState();
            
            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

//Initialize App
App.init()