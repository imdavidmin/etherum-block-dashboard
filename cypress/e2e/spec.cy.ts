const PAGE_URL = 'http://localhost:3000'

describe('Page initial load', () => {
    beforeEach(() => {
        cy.visit(PAGE_URL)
    })

    it('should load the page with the main div containers', () => {
        cy.title().should('equal', 'Infura Block Explorer')
        cy.get('div.sidebar').should('exist')
        cy.get('div.key-stats-container').should('exist')
        cy.get('div.card-grid').should('exist')
    })

    it('should have all sidebar buttons', () => {
        const buttonText = [
            'dashboard',
            'projects',
            'explorer',
            'settings',
            'logout',
        ]
        buttonText.forEach((text) =>
            cy.get('div.sidebar').should('contain', text, { matchCase: false })
        )
    })
})

describe('Components on initial load', () => {
    beforeEach(() => {
        cy.visit(PAGE_URL)
    })
    describe('Block card grid', () => {
        it('should have 10 block cards and 1 new block card', () => {
            cy.get('div.block-card')
                .should('have.length', 11)
                .and('have.class', 'block-card')
            cy.get('div.block-card.new')
                .should('have.length', 1)
                .and('have.class', 'new')
        })
    })
    describe('Block card', () => {
        it('should have 3 shimmer divs in block card header', () => {
            cy.get('div.block-card:not(.new) div.header-bar').each(
                (headerBar) => {
                    cy.wrap(headerBar)
                        .find('div.shimmer')
                        .should('have.length', 3)
                }
            )
        })
        it('should have 25 tx blocks when no data is loaded', () => {
            cy.get('div.block-card:not(.new)').each((headerBar) => {
                cy.wrap(headerBar)
                    .find('div.tx-square')
                    .should('have.length', 25)
            })
        })
    })
    describe('"Load More" button', () => {
        it('should exist', () => {
            cy.get('div.grid-footer button')
                .should('have.length', 1)
                .contains('load more', { matchCase: false })
        })
    })
})

describe('Data loading, assumed 5 seconds wait', () => {
    const WAIT_TIME = 3000

    beforeEach(() => {
        cy.visit(PAGE_URL)
        cy.wait(WAIT_TIME)
    })
    describe('In block cards', () => {
        it('should no longer have shimmers', () => {
            cy.get('div.block-card:not(.new)').each((card) => {
                cy.wrap(card).find('div.shimmer').should('not.exist')
            })
        })
        it('should load the block number', () => {
            cy.get('div.block-card:not(.new)').each((card) => {
                cy.wrap(card)
                    .get('.header-bar>div>span:first-child')
                    .then((span) => {
                        const value = Number.parseInt(span.text().slice(1))
                        expect(Number.isInteger(value)).to.equal(true)
                    })
            })
        })
        it('should have one card that has more than 100 transactions', () => {
            cy.get('div.block-card')
                .contains('more tx', { matchCase: false })
                .should('have.length.at.least', 1)
                .each((card) => {
                    cy.wrap(card)
                        .get('.header-bar>div>span:last-child')
                        .then((span) => {
                            const value = Number.parseInt(
                                span.text().split(' ')[0]
                            )
                            expect(Number.isInteger(value)).to.equal(true)
                            expect(value).to.greaterThan(100)
                        })
                })
        })
    })
})

describe('Interacting with the block card', () => {
    const WAIT_TIME = 3000

    beforeEach(() => {
        cy.visit(PAGE_URL)
        cy.wait(WAIT_TIME)
    })

    it('should show a tooltip on hover of a tx square', () => {
        cy.get('div.tx-square').eq(0).trigger('mouseenter')
        cy.get('div.tx-square>div.tooltip-container').should('be.visible')
    })

    it('should show different squares on pagination', () => {
        const initialOrder = []
        const newOrder = []

        cy.contains('div.block-card', 'more tx', { matchCase: false }).then(
            (cardWithPagination) => {
                // Record the initial state of blocks being highlighted as confirmed

                cy.wrap(cardWithPagination)
                    .find('div.tx-square')
                    .should('have.length', 100)
                    .each((tx) => initialOrder.push(tx.hasClass('confirmed')))
                    .then(() => {
                        cy.wrap(cardWithPagination).within(() => {
                            cy.get('button')
                                .click()
                                .then(() => {
                                    cy.wrap(cardWithPagination)
                                        .find('div.tx-square')
                                        .should('have.length.at.least', 1)
                                        .each((tx) =>
                                            newOrder.push(
                                                tx.hasClass('confirmed')
                                            )
                                        )
                                        .then(() => {
                                            expect(newOrder).not.to.deep.equal(
                                                initialOrder
                                            )
                                        })
                                })
                        })
                    })
            }
        )
        cy.get('div.block-card button')
    })
})
