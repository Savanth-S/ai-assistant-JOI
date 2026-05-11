const testPost = (req, res) => {
  res.json({ received: req.body });
};

module.exports = { testPost };