import { app } from './app.js';

const PORT = process.env.PORT || 3000;

// Start server (only when running directly, not when imported for tests)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


