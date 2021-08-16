export class Blog{
  PK: string;
  SK: string;
  title: string;
  content: string;
  img: string;
  date: string;

  constructor(PK: string, SK: string, title: string, content: string, img: string, date: string) {
    this.PK = PK;
    this.SK = SK;
    this.title = title;
    this.content = content;
    this.img = img;
    this.date = date;
  }
}
