import Storage from './Storage';

export default class Trello {
    constructor(document) {
      this.addLink = document.querySelectorAll('.add-link');
      this.column = document.querySelectorAll('.column');
      this.columnTodo = document.querySelector('.todo');
      this.columnInProgress = document.querySelector('.in-progress');
      this.storageButtonSave = document.querySelector('.save');
      this.storageButtonReset = document.querySelector('.reset');
      this.columnDone = document.querySelector('.done');
      this.storage = new Storage();
      this.data = {};
      this.loadData = this.storage.load();
    }

    static get enteringMarkup() {
        return `
        <div class="new-card">
        <textarea id="card-content" name="card-content" class="card-content" placeholder="Enter a title for this card..."></textarea>
        <input type="button" id="card-button" name="card-button" class="card-button" value="Add card">
        <input type="button" id="close-button" name="close-button" class="close-button" value="X">
        </div>`;
      }
    
      pageLoading() {
        if(this.loadData === null || this.loadData.toDo === undefined){
        this.start();
        } else {
          this.loadStorage(this.loadData);
          this.start();
        }
      }
    
      start() {
          this.addCard();
          this.cardClose();
          this.cardDrag();
          this.storageButtonsActivator();
    }

    addCard() {
      this.addLink.forEach(e => {

        e.addEventListener('click', () => {
          
          let newNode = this.constructor.enteringMarkup;
          
          e.insertAdjacentHTML('beforebegin', newNode);
          e.classList.add('unactive');

          let newCard = e.previousSibling;
          let cardButton = newCard.querySelector('.card-button');
          let closeButton = newCard.querySelector('.close-button');
          
          cardButton.addEventListener('click', () => {
            let cardContent = newCard.querySelector('.card-content');

            e.insertAdjacentHTML('beforebegin', `
              <div class="card">
              <input type="button" id="card-close-button" name="card-close-button" class="card-close-button unactive" value="X">
              <p>${cardContent.value}</p>
              </div>`);
            e.classList.remove('unactive');
            newCard.remove();
          });

          closeButton.addEventListener('click', () => {
            e.classList.remove('unactive');
            newCard.remove();
          });
        });
      });
    }

    cardClose() {
      
      let closeButtonActivator = function(e) {
        if(e.target.classList.contains('card')) {
          let closeButton = e.target.querySelector('.card-close-button');
          e.target.addEventListener('mouseenter', () => {
            closeButton.classList.remove('unactive');
          });
          e.target.addEventListener('mouseleave', () => {
            closeButton.classList.add('unactive');
          });
          closeButton.addEventListener('click', () => {
            e.target.remove();
          });
        }
          
      }

      this.column.forEach(el => 
        el.addEventListener('mouseover', closeButtonActivator));
    } 

    cardDrag() {
      this.column.forEach(el => {
      let actualElement;

      const onMouseUp = (e) => {
        if(actualElement.classList.contains('card')){
        const mouseUpItem = e.target;
        
        if(mouseUpItem.classList.contains('card')) {
          mouseUpItem.after(actualElement);
        }

        if(mouseUpItem.classList.contains('column-title')) {
          mouseUpItem.after(actualElement);
        }

        if(mouseUpItem.classList.contains('add-link')) {
          mouseUpItem.before(actualElement);
        }
       
        actualElement.classList.remove('dragged');

        actualElement = undefined;

        document.documentElement.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseover', onMouseOver);
        }
      };


      const onMouseOver = (e) => {
        actualElement.style.top = e.clientY + 'px';
        actualElement.style.left = e.clientX + 'px';
        
      };

      
        el.addEventListener('mousedown', (e) => {
          actualElement = e.target;
          
          if(actualElement.classList.contains('card')){
            actualElement.classList.add('dragged');
            e.preventDefault();
          }

          document.documentElement.addEventListener('mouseup', onMouseUp);
          document.documentElement.addEventListener('mouseover', onMouseOver);
        });
      });
    }

    storageButtonsActivator() {
      this.storageButtonReset.addEventListener('click', () => {
        Array.from(document.querySelectorAll('.card')).forEach(el => {
          el.remove();
        })

        this.storage.remove();
      });

      this.storageButtonSave.addEventListener('click', () => {
        const columnTodo = Array.from(document.querySelector('.todo').querySelectorAll('.card'));
        const columnInProgress = Array.from(document.querySelector('.in-progress').querySelectorAll('.card'));
        const columnDone = Array.from(document.querySelector('.done').querySelectorAll('.card'));
        this.data.toDo = [];
        this.data.inProgress = [];
        this.data.done = [];
        columnTodo.forEach((item) => {
          this.data.toDo.push(item.textContent);
        });
        columnInProgress.forEach((item) => {
          this.data.inProgress.push(item.textContent);
        });
        columnDone.forEach((item) => {
          this.data.done.push(item.textContent);
        });
      
        this.storage.save(this.data);
      });
    }

    loadStorage(data) {
      let cardLoading = function(column, content) {
        const card = document.createElement('div');
        const cardContent = document.createElement('p');
        const closeButton = document.createElement('input');

        card.classList.add('card');
        closeButton.classList.add('card-close-button');
        closeButton.classList.add('unactive');
        closeButton.type = 'button';
        closeButton.value = 'X';

        cardContent.textContent = content;

        column.querySelector('.add-link').parentNode.insertBefore(card, column.querySelector('.add-link'));
        card.prepend(cardContent);
        card.prepend(closeButton);
      }
      
      data.toDo.forEach((element) => {
        cardLoading(this.columnTodo, element);
      });
      data.inProgress.forEach((element) => {
        cardLoading(this.columnInProgress, element);
      });
      data.done.forEach((element) => {
        cardLoading(this.columnDone, element);
      });
    }

  
  }