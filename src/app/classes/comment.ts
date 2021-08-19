export class Comment{
  PK: string;
  SK: string;
  comment: string;
  date: string;
  username: string;
  father_id?: string;
  son_ids: string[];
  up_votes: string[];
  down_votes: string[];
  replies: Comment[];
  votes: number;


  constructor(PK: string, SK: string, comment: string, date: string, username: string, son_ids: string[], up_votes: string[], down_votes: string[]) {
    this.PK = PK;
    this.SK = SK;
    this.comment = comment;
    this.date = date;
    this.username = username;
    this.replies = [];
    this.up_votes = up_votes;
    this.down_votes = down_votes;
    this.votes = up_votes.length - down_votes.length;
    this.son_ids = son_ids;
  }

  addReply(reply: Comment){
    this.replies.push(reply);
  }
}
