// Рендерим компонент
const renderComponent = (elementContainer, markup, where = `afterend`) => {
  return elementContainer.insertAdjacentHTML(where, markup);
};

export {renderComponent};

