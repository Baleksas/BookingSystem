import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql"; // ES6
import { buildSchema } from "graphql";
import EventSchema from "./Schema/Types/EventSchema";
import EventInput from "./Schema/Inputs/EventInput";
import Root from "./Schema/Root";
import mongoose from "mongoose";

let Event = require("./models/event");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema([Root, EventSchema, EventInput].join(" ")),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events: any) => {
            return events.map((event: any) => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      },
      createEvent: (args: any) => {
        //  22:34
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });

        return event
          .save()
          .then((result: any) => {
            console.log(result);
            return {
              ...result._doc,
              _id: result.id,
            };
          })
          .catch((error: any) => {
            console.log(error);
            throw error;
          });

        return event;
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    // `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tlqlq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    `mongodb+srv://new_user_1:a2uBNu3eKXWytU6@cluster0.tlqlq.mongodb.net/events-react-dev?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
