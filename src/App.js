import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState({});

  function handleAddFriend(friend) {
    setFriendsList((currFriendList) => [...currFriendList, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((selected) => (selected.id === friend.id ? {} : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(val) {
    setFriendsList((currFriends) =>
      currFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );

    setSelectedFriend({});
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          friendsList={friendsList}
          onSelectingFriend={handleSelectedFriend}
        ></FriendsList>
        {showAddFriend && (
          <FormAddFriend onAddFriend={handleAddFriend}></FormAddFriend>
        )}
        <Button
          onBtnClick={() => setShowAddFriend((showAddFriend) => !showAddFriend)}
        >
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      <div>
        {Object.keys(selectedFriend).length > 0 && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          ></FormSplitBill>
        )}
      </div>
    </div>
  );
};

function FriendsList({ friendsList, onSelectingFriend, selectedFriend }) {
  return (
    <ul>
      {friendsList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectingFriend={onSelectingFriend}
          selectedFriend={selectedFriend}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectingFriend, selectedFriend }) {
  function handleBtnClick() {
    onSelectingFriend(friend);
  }
  const isSelected = selectedFriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onBtnClick={handleBtnClick}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onBtnClick }) {
  return (
    <button className="button" onClick={onBtnClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [paidByUser, setPaidByUser] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) {
      return;
    }

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => {
          if (Number(e.target.value)) {
            setBill(Number(e.target.value));
          } else {
            setBill(0);
          }
        }}
      ></input>

      <label>My expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => {
          if (Number(e.target.value)) {
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            );
          }
        }}
      ></input>

      <label>{selectedFriend.name} expense</label>
      <input type="text" value={paidByFriend} disabled></input>

      <label>Who is paying the bill</label>

      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
