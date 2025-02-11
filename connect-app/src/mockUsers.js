const mockUsers = [
    { email: "mainuser1@gmail.com", password: "123456", type: "main", media: [] },

    {email: "mainuser2@gmail.com", password: "california", type: "main", media: [
      { type: "photo", url: "https://via.placeholder.com/150", uploadedBy: "supportuser1@gmail.com" },
      { type: "photo", url: "https://via.placeholder.com/150", uploadedBy: "supportuser2@gmail.com" },
      { type: "message", text: "I hope you're doing well!", uploadedBy: "supportuser1@gmail.com", date: "2025-02-10" },
      {type: "message", text: "We are so proud of you!", uploadedBy: "supportuser2@gmail.com", date: "2025-02-02"},
      {type: "message", text: "Hi Grandpa", uploadedBy: "supportuser2@gmail.com", date: "2025-02-02"},
      {type: "message", text: "W Gramps", uploadedBy: "supportuser2@gmail.com", date: "2025-01-22"},
      {type: "message", text: "Hi, how are you?", uploadedBy: "supportuser2@gmail.com", date: "2025-01-20"},
    ] },

    { email: "supportuser1@gmail.com", password: "calstate", type: "support" },
    { email: "supportuser2@gmail.com", password: "csuf", type: "support" },
    { email: "bothuser1@gmail.com", password: "fullerton", type: "both" },
  ];
  
  export default mockUsers;
  