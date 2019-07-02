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
        items: []
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
        setCurrentItem: function(itemID) {
            currentItem = (data.items[itemID]);
            return currentItem;
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
        itemDelete: '.item-delete'
    }

    // Public methods
    return {
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function(e) {
            return {
                amount:e.target[0].value,
                currency:e.target[1].value,
                category:e.target[2].value,
                date:new Date(e.target[3].value)
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

        // Delete item event
        document.querySelector('ul').addEventListener('click', itemLinkClick);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Delete item during edit state
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemLinkClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {

        // Get form input from UI controller
        const input = UICtrl.getItemInput(e);

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

        if (itemClicked.classList.contains("item-delete")) {

            // Delete item from data structure
            ItemCtrl.deleteItem(itemClicked.parentNode.id);

            // Delete item from UI
            UICtrl.deleteListItem(itemClicked.parentNode);

            } else if (itemClicked.classList.contains("item-edit")) {

                // Get item ID
                let itemToEdit = itemClicked.parentNode.id;

                // Get item from data array
                let currentItem = ItemCtrl.setCurrentItem(itemToEdit);

                // Populate fields
                UICtrl.addItemToForm(currentItem);

            } else if (itemClicked.classList.contains("delete-edit-state")) {

                // Clear fields
                UICtrl.clearEditState();

            }
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