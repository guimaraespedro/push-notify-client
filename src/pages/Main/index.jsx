import { useEffect, useState } from "react";
import styles from "./main.module.css";
import UilBell from "@iconscout/react-unicons/icons/uil-bell";
import Logoff from "@iconscout/react-unicons/icons/uil-sign-out-alt";
import { BigHead } from "@bigheads/core";
import { sendNotification, getAllFriends } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Main = () => {
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState({});
  const [notificationContent, setNoitificationContent] = useState("");
  const [title, setTitle] = useState("");
  const { sessionData, logoff } = useAuth();

  function onOpenMessageBox(friend) {
    if (friend.id === activeFriend?.id) {
      setActiveFriend({});
      return;
    }
    setActiveFriend(friend);
  }

  async function getFriends() {
    const response = await getAllFriends();
    const friends = response.data;
    setFriends(friends);
  }

  function handleSendNotification(event) {
    event.preventDefault();
    const { user } = sessionData;
    sendNotification(title, notificationContent, activeFriend.id, user.id)
      .then(() => {
        toast("notification successfully sent");
      })
      .catch((error) => console.error(error));
  }

  function handleLogoff() {
    logoff();
  }

  useEffect(() => {
    try {
      getFriends();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <aside>
        <UilBell size={100} />
        <header>Choose someone to send a notification</header>
        <button onClick={handleLogoff}>{<Logoff size={15} />} Log Off</button>
        {friends &&
          friends.map((friend) => (
            <div
              key={friend.id}
              className={styles.friendContainer}
              onClick={() => onOpenMessageBox(friend)}
            >
              <BigHead
                className={styles.avatar}
                accessory="shades"
                body="chest"
                circleColor="blue"
                clothing="tankTop"
                clothingColor="black"
                eyebrows="angry"
                eyes="wink"
                facialHair="mediumBeard"
                graphic="vue"
                hair="short"
                hairColor="black"
                hat="none"
                hatColor="green"
                lashes="false"
                lipColor="purple"
                mouth="open"
                skinTone="brown"
              />
              <p>{friend.name}</p>
            </div>
          ))}
      </aside>
      <div className={styles.contentContainer}>
        <header className={styles.defaultHeader}>
          <h1>Hello you are logged in</h1>
        </header>
        {activeFriend && activeFriend.id && (
          <form action="" onSubmit={handleSendNotification}>
            <div className={styles.inputContainer}>
              <p>Write your message to {activeFriend.name} here:</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                className={styles.notificationTitle}
              />
              <textarea
                onChange={(event) =>
                  setNoitificationContent(event.target.value)
                }
                value={notificationContent}
                name="content"
                type="text"
              ></textarea>
            </div>
            <button
              type="submit"
              placeholder="Write the notification content here..."
              value="Submit"
            >
              Send
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
