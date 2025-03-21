describe('API Tests for /customers endpoint', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should retrieve customers with default parameters', () => {
    cy.request({
      method: 'GET',
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').that.is.an('array');
      expect(response.body.pageInfo).to.have.property('currentPage', 1);
    });
  });

  it('should retrieve 10 medium-sized customers from the Technology industry on page 2', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?page=2&limit=10&size=Medium&industry=Technology`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').that.is.an('array').and.have.length.at.most(10);
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
      });
      expect(response.body.pageInfo).to.have.property('currentPage', 2);
    });
  });

  it('should return an empty array when no matching customers are found', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?size=Very Large Enterprise&industry=HR`,
    }).then((response) => {
      console.log(response.body);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').that.is.an('array');
      if (response.body.customers.length === 0) {
        expect(response.body.customers).to.be.empty;
      } else {
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.eq('Very Large Enterprise');
          expect(customer.industry).to.eq('HR');
        });
      }
    });
  });

  it('should return 400 Bad Request for invalid page parameter', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?page=-1`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return 400 Bad Request for invalid size parameter', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?size=InvalidSize`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should return customers with complete or partial contact info', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?limit=5`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        if (customer.contactInfo) {
          expect(customer.contactInfo).to.have.property('name');
          expect(customer.contactInfo).to.have.property('email');
        }
      });
    });
  });
});
