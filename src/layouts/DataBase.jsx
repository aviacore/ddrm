class Content {
  constructor(id, name, price, descr) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.descr = descr;
  }
}

class PurchasedContent extends Content {
  constructor(id, name, price, descr, time) {
    super(id, name, price, descr);

    this.time = time;
  }
}

export const DataBase = [
  new Content(1, 'Project1', 12, 'blablalba'),
  new Content(2, 'Project2', 56, 'helloworld'),
  new Content(3, 'Project3', 21, 'blahblah'),
  new Content(4, 'Project4', 98, 'trololo')
];

export const DataBasePurchased = [
  new PurchasedContent(DataBase[0].id, DataBase[0].name, DataBase[0].price, DataBase[0].descr, '20min'),
  new PurchasedContent(DataBase[2].id, DataBase[2].name, DataBase[2].price, DataBase[2].descr, '30min'),
];
