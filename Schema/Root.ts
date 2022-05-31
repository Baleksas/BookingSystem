export default `
  type RootQuery {
    events:[Event!]!                              
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `;
