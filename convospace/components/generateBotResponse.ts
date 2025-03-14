export const generateBotResponse = (message: string): { text: string; sender: "bot" } => {
  const lowerMsg = message.toLowerCase();
  let response = "🤖 Sorry, I didn't understand. Try `/create-server`, `/add-member`, `/delete-server`, `/create-channel`,`/one-on-one-chat`, or `/delete-edit-message` ";


  if (lowerMsg.includes("/create-server")) {
    response = "🎮 To create a server on ConvoSpace, click '+' and select 'Create a Server'.";
  } else if (lowerMsg.includes("/delete-server")) {
    response = "⚠️ To delete a server, go to Server Settings > Delete Server.";
  } else if (lowerMsg.includes("/add-member")) {
    response = "👥 To add new members, use the 'Invite People' option in Server Settings.";
  } else if (lowerMsg.includes("/create-channel")) {
    response = "📢 To create a channel, go to Server Settings > Create Channel, choose the type of channel, and give it a name.";
  } else if (lowerMsg.includes("/one-on-one-chat")) {
    response = "💬 To start a one-on-one chat, search for a specific member and chat directly.";
  } else if (lowerMsg.includes("/delete-edit-message")) {
    response = "✏️ To delete or edit a message, hover over the message you want to modify and click on the icon.";
  }

  return { text: response, sender: "bot" };
};
