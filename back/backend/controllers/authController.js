const { StreamChat } = require('stream-chat');

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

const serverSideClient = new StreamChat(streamApiKey, streamApiSecret);

exports.customerLogin = async (req, res) => {
  try {
    const firstName = req.body.firstName.replace(/\s/g, '_');
    const lastName = req.body.lastName.replace(/\s/g, '_');
    const username = `${firstName}${lastName}`.toLowerCase();

    const customerToken = serverSideClient.createToken(username);
    await serverSideClient.updateUser({ id: username, name: firstName, role: 'user' }, customerToken); // Pavle ovde sam dodao role user

    const channel = serverSideClient.channel('messaging', username, {
      name: `Chat with ${username}`,
      created_by: { id: 'admin' },
      members: [username, 'admin']
    });

    await channel.create();
    await channel.addMembers([username, 'admin']);

    res.status(200).json({ customerId: username, channelId: username, customerToken, streamApiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const username = req.body.adminId.replace(/\s/g, '_').toLowerCase();
    const adminToken = serverSideClient.createToken(username);

    await serverSideClient.updateUser({ id: 'admin', name: 'admin', role: 'admin' }, adminToken); // Pavle ovde sam dodao role admin

    const channel = serverSideClient.channel('messaging', "livechat", {
      name: "Customer Support Dashboard",
      created_by: { id: 'admin' }
    });

    await channel.create();
    await channel.addMembers(['admin']);

    res.status(200).json({ adminName: username, adminToken, streamApiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.customerRegister = async (req, res) => {
  try {
    const firstName = req.body.firstName.replace(/\s/g, '_');
    const lastName = req.body.lastName.replace(/\s/g, '_');
    const username = `${firstName}${lastName}`.toLowerCase();

    // proveri da li user već postoji
    const { users } = await serverSideClient.queryUsers({ id: username });
    if (users.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // kreiraj user-a
    const customerToken = serverSideClient.createToken(username);
    await serverSideClient.updateUser({ id: username, name: firstName }, customerToken);

    // opcionalno kreiraj kanal za chat sa adminom
    const channel = serverSideClient.channel('messaging', username, {
      name: `Chat with ${username}`,
      created_by: { id: 'admin' },
      members: [username, 'admin']
    });

    await channel.create();
    await channel.addMembers([username, 'admin']);

    res.status(201).json({
      customerId: username,
      channelId: username,
      customerToken,
      streamApiKey,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.adminRegister = async (req, res) => {
  try {
    const username = req.body.adminId.replace(/\s/g, '_').toLowerCase();

    const { users } = await serverSideClient.queryUsers({ id: username });
    if (users.length > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const adminToken = serverSideClient.createToken(username);
    await serverSideClient.updateUser({ id: username, name: 'admin' }, adminToken);

    res.status(201).json({ adminName: username, adminToken, streamApiKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};