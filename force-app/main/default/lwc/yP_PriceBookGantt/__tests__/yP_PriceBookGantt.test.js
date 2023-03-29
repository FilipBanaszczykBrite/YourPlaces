import { createElement } from 'lwc';
import YP_PriceBookGantt from 'c/yP_PriceBookGantt';

describe('c-y-p-price-book-gantt', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: test case generated by CLI command, please fill in test logic', () => {
        // Arrange
        const element = createElement('c-y-p-price-book-gantt', {
            is: YP_PriceBookGantt
        });

        // Act
        document.body.appendChild(element);

        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(1).toBe(1);
    });
});