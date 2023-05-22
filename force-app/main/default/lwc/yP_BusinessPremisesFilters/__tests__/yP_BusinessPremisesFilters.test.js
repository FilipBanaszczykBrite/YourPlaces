import { createElement } from 'lwc';
import YP_BusinessPremisesFilters from 'c/yP_BusinessPremisesFilters';

describe('c-y-p-business-premises-filters', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: test case generated by CLI command, please fill in test logic', () => {
        // Arrange
        const element = createElement('c-y-p-business-premises-filters', {
            is: YP_BusinessPremisesFilters
        });

        // Act
        document.body.appendChild(element);

        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(1).toBe(1);
    });
});