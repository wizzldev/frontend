export interface Contact {
  id: number;
  name: string;
  image: string;
  last_message: {
    content: string;
    date: string;
  };
}

export type Contacts = Array<Contact>
