import { useEffect, useState } from 'react';
import { FetchAllChatItems } from '../../Api/Chat/chat';
import './Chat.scss';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all chat items on component mount
  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await FetchAllChatItems(); // Make sure this function fetches the data
        setChats(data); // Assuming it returns the chat data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        setLoading(false);
      }
    };

    getChats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat">
      <h2>Chat Logs</h2>
      <div className="chat-table-container"> {/* Wrapper for horizontal scroll */}
        <table className="chat-table">
          <thead>
            <tr>
              <th>n°</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Messages</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat.idClient}>
                <td>{chat.idClient}</td>
                <td>{chat.nomPrenon}</td>
                <td>{chat.email}</td>
                <td>{chat.telephone}</td>
                <td>
                  {chat.message.map((msg, index) => (
                    <div key={index}>
                      <p>{msg.content}</p>
                      <span>{new Date(msg.date).toLocaleString()}</span>
                    </div>
                  ))}
                </td>
                <td>{new Date(chat.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chat;