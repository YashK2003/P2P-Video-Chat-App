import "./message.css";
import { format } from "timeago.js"



export default function Message({ message, own }) {

  const string = message.text;
  const substring = "https://ik.imagekit.io/tb5em07q5";

  // console.log(string.includes(substring));
  // console.log(string.indexOf(substring) !== -1); // true

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
       { !string.includes(substring) && <p className="messageText"> {message.text} </p>}
       { string.includes(substring) && <img className="messageimage"
      src={message.text}
      alt="new"
      />}
      </div>
      <div className="messageBottom"> {format(message.createdAt)} </div>
    </div>
  );
}