import { ListItem } from '../ListItem/index.js';

export const ShopList = (props) => {
  const { day, dayResult } = props;

  let dayName = 'Načítám...';
  if (dayResult !== 'loading') {
    dayName = dayResult.dayName;
  }

  const element = document.createElement('div');
  element.classList.add('shoplist');
  element.innerHTML = `
    <div class="shoplist__head">
      <h2 class="shoplist__day">${dayName}</h2>
      <div class="shoplist__toolbar">
        <button class="reset-btn">obnovit</button>
      </div>
    </div>
    <form class="shoplist__new">
      <div class="form-fields">  
        <input class="field-input product-input" type="text" />
        <input class="field-input amount-input" type="text" />
        <input class="field-input unit-input" type="text" />
      </div>
      <div class="form-controls">
        <button class="btn-add">Přidat</button>
      </div>
    </form>
    <div class="shoplist__items"></div>
  `;

  // Vytořte posluchač události handleReset a připojte jej na tlačítko. Je to velmi podobné tomu, jak je vytvořen posluchač handleSubmit. Do vašeho posluchače zatím dejte například console.log, a vyzkoušejte, že funguje.
  const handleReset = () => {
    console.log('klikám');
  };

  element.querySelector('.reset-btn').addEventListener('click', handleReset);

  if (dayResult === 'loading') {
    fetch(`https://nakupy.kodim.app/api/me/week/${day}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(
          ShopList({
            day: day,
            dayResult: data.result,
          }),
        );
      });

    return element;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const productInput = element.querySelector('.product-input');
    const amountInput = element.querySelector('.amount-input');
    const unitInput = element.querySelector('.unit-input');

    fetch(`https://nakupy.kodim.app/api/me/week/${day}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        product: productInput.value,
        amount: Number(amountInput.value),
        unit: unitInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(ShopList({ day, dayResult: data.result }));
      });
  };

  element
    .querySelector('.shoplist__new')
    .addEventListener('submit', handleSubmit);

  const itemsElement = element.querySelector('.shoplist__items');
  itemsElement.append(...dayResult.items.map((item) => ListItem(item)));

  return element;
};
