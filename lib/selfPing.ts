// lib/selfPing.ts
export function startSelfPing() {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      fetch("https://document-mjk8.onrender.com/api/ping")
        .then(() => console.log('Self-ping successful'))
        .catch((err) => console.error('Self-ping failed:', err));
    }, 10 * 60 * 1000); // every 10 minutes
  }
}
