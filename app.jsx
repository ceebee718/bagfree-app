
try {
const { useState } = React;

const LOGO_SRC = '/bagfree-logo-web.png';

const ESSENTIALS_IMG = '/essentials-card.jpg';

const Icon = {
  Diamond: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2 L22 12 L12 22 L2 12 Z"/><path d="M12 6 L18 12 L12 18 L6 12 Z"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Clipboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 2 h6 v4 H9 z"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>,
  Map: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6 v16 l7 -3 l8 3 l7 -3 V3 l-7 3 l-8 -3 z"/><line x1="8" y1="3" x2="8" y2="19"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Bag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8 h12 v12 a2 2 0 01-2 2 H8 a2 2 0 01-2 -2 Z"/><path d="M9 8 V6 a3 3 0 116 0 v2"/></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.6 a5.5 5.5 0 00-7.78 0 L12 5.67 l-1.06 -1.07 a5.5 5.5 0 00-7.78 7.78 l1.06 1.06 L12 21.23 l7.78 -7.78 l1.06 -1.06 a5.5 5.5 0 000 -7.78 z"/></svg>,
  Gift: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7 H7.5 a2.5 2.5 0 010 -5 C11 2 12 7 12 7 z"/><path d="M12 7 h4.5 a2.5 2.5 0 000 -5 C13 2 12 7 12 7 z"/></svg>,
  Hotel: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="1"/><circle cx="9" cy="8" r="0.6" fill="currentColor"/><circle cx="15" cy="8" r="0.6" fill="currentColor"/><circle cx="9" cy="12" r="0.6" fill="currentColor"/><circle cx="15" cy="12" r="0.6" fill="currentColor"/><circle cx="9" cy="16" r="0.6" fill="currentColor"/><circle cx="15" cy="16" r="0.6" fill="currentColor"/><path d="M10 21 v-3 h4 v3"/></svg>,
  Help: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9 a3 3 0 015.83 1 c0 2 -3 3 -3 3"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 18 h20 l-2 -12 l-5 4 l-5 -7 l-5 7 l-5 -4 z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8 A6 6 0 006 8 c0 7 -3 9 -3 9 h18 s-3 -2 -3 -9"/><path d="M13.73 21 a2 2 0 01-3.46 0"/></svg>,
  Chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2 v2 M12 20 v2 M4.93 4.93 l1.41 1.41 M17.66 17.66 l1.41 1.41 M2 12 h2 M20 12 h2 M4.93 19.07 l1.41 -1.41 M17.66 6.34 l1.41 -1.41"/></svg>,
  Pin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10 c0 7 -9 13 -9 13 s-9 -6 -9 -13 a9 9 0 0118 0 z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>,
  Hanger: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 6 a2 2 0 102 -2"/><path d="M3 18 l9 -6 l9 6"/><path d="M3 18 h18"/></svg>,
  Dome: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 18 h18"/><path d="M4 18 a8 8 0 0116 0"/><circle cx="12" cy="6" r="1"/><line x1="12" y1="7" x2="12" y2="10"/></svg>,
  Leaf: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 22V8"/><path d="M12 8c-2-6 4-7 8-6-1 6-5 9-8 6z"/><path d="M12 14c1-4-3-5-6-4 1 4 4 6 6 4z"/></svg>,
  Cup: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 8 h13 v6 a5 5 0 01-5 5 h-3 a5 5 0 01-5 -5 z"/><path d="M17 9 h2 a3 3 0 010 6 h-2"/><path d="M7 2 c0 1.5 1 2 1 3.5"/><path d="M11 2 c0 1.5 1 2 1 3.5"/></svg>,
  Bottle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M9 3 h6 v3 l1 2 v11 a2 2 0 01-2 2 h-4 a2 2 0 01-2 -2 V8 l1 -2 z"/><line x1="9" y1="12" x2="15" y2="12"/></svg>,
  Person: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="8" r="4"/><path d="M4 21 v-1 a7 7 0 0114 0 v1"/></svg>,
  Compass: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="3" width="16" height="18" rx="1"/><circle cx="9" cy="8" r="0.6" fill="currentColor"/><circle cx="15" cy="8" r="0.6" fill="currentColor"/><circle cx="9" cy="12" r="0.6" fill="currentColor"/><circle cx="15" cy="12" r="0.6" fill="currentColor"/><path d="M10 21 v-3 h4 v3"/></svg>,
  GiftBox: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7 H7.5 a2.5 2.5 0 010 -5 C11 2 12 7 12 7 z"/><path d="M12 7 h4.5 a2.5 2.5 0 000 -5 C13 2 12 7 12 7 z"/></svg>,
  Star: () => <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Package: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16 V8 a2 2 0 00-1 -1.73 l-7 -4 a2 2 0 00-2 0 l-7 4 A2 2 0 003 8 v8 a2 2 0 001 1.73 l7 4 a2 2 0 002 0 l7 -4 A2 2 0 0021 16 z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5 a8.38 8.38 0 01-.9 3.8 a8.5 8.5 0 01-7.6 4.7 a8.38 8.38 0 01-3.8 -.9 L3 21 l1.9 -5.7 a8.38 8.38 0 01-.9 -3.8 a8.5 8.5 0 014.7 -7.6 a8.38 8.38 0 013.8 -.9 h.5 a8.48 8.48 0 018 8 z"/></svg>,
  Swap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3 L13.5 9 L19.5 10.5 L13.5 12 L12 18 L10.5 12 L4.5 10.5 L10.5 9 Z"/><path d="M19 17 L19.7 19 L21.5 19.7 L19.7 20.5 L19 22.5 L18.3 20.5 L16.5 19.7 L18.3 19 Z"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c4.5 0 8-3.5 8-7.5 0-3-2-5.5-3-6-1 2.5-2 3.5-2.5 3 0-2 1-5.5-2.5-9-1 4.5-3 4.5-4 8.5-.5 2-.5 4 0 6 1 2.5 2.5 4 4 5z"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM21 5h-4M3 5h4"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 22 12 6 20 6 4"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  TikTok: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82a4.28 4.28 0 01-1.21-1.16 4.16 4.16 0 01-.81-2.66H11.4v11.71a2.55 2.55 0 01-2.55 2.55 2.55 2.55 0 010-5.1c.14 0 .27.02.4.04V8a5.62 5.62 0 105.62 5.62V8.05a7.05 7.05 0 004.13 1.32V6.18a4.18 4.18 0 01-2.4-.36z"/></svg>,
  Instagram: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
  YouTube: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.9 4 12 4 12 4s-4.9 0-8 .2c-.4 0-1.3 0-2.1 1C1.2 5.9 1 7.5 1 7.5S.8 9.3.8 11.2v1.7c0 1.8.2 3.7.2 3.7s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.2 7.7.2s4.9 0 8-.2c.4 0 1.3 0 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.7c0-1.8-.2-3.7-.2-3.7zM9.7 14.6V8.4l6.4 3.1z"/></svg>,
  Threads: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17.5 11.5c-.5-3-2.5-4.5-5-4.5-3 0-4.5 1.5-4.5 3.5 0 1.5 1 2.5 3 3 1.5.4 5 .8 5 3 0 2-2 3-4 3-2.5 0-4-1.5-4.5-3"/></svg>,
  Twitter: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Reddit: () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 16c1 1 2 1.3 3 1.3s2-.3 3-1.3" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>,
  Vimeo: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.97 6.44c-.1 2.18-1.62 5.16-4.57 8.95-3.05 3.96-5.64 5.94-7.75 5.94-1.31 0-2.42-1.21-3.32-3.63-.61-2.21-1.21-4.42-1.82-6.64-.67-2.41-1.39-3.62-2.17-3.62-.17 0-.76.36-1.78 1.07L1.5 7.13c1.12-.98 2.21-1.96 3.31-2.94 1.5-1.3 2.63-1.98 3.38-2.05 1.78-.17 2.87 1.05 3.28 3.66.44 2.83.75 4.58.92 5.27.5 2.27 1.06 3.4 1.66 3.4.47 0 1.17-.74 2.12-2.22.94-1.48 1.45-2.6 1.51-3.37.13-1.21-.34-1.82-1.41-1.82-.5 0-1.02.12-1.55.34 1.04-3.4 3.02-5.06 5.94-4.97 2.17.06 3.19 1.47 3.06 4.21z"/></svg>
};

const SecondJourneyIcon = () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAALdklEQVR42r1Ya3hU5bV+1957bpkwYXIjhHAJIALBSrFywCMloVY9lNrTUzNiLQ+CJSqKRfFCqzAzcjFQxSZyC0piNAjO4KWIgILMcIkBQYiVxACBQO7JJJlcJnPde6/zY4gCAu15znnOep7vz7f3Xt/7rfV+a73fJtzA2GoVYLOBiFQAyFuxOen2SZw5IFE/RSeGpqpqOF2jFftpNAKUsAKfX/YLonhBVam02RtxfX4wuNduf7Zt+/b8R+SeSMXMOYuOMFsFIrt6vTXpumDYIRJZFADYs7PgjmGDY/6YEKPOSEyMSYIkobPFi95QyBsOhroYHAQrWo0gmPUGrTlpgBEc0aC5rafpfFOkoL9RvFenQUrJJ6232mw2n81mg91+bVDXAkTMDoHIomzbtn7cxLFxSwckS9kx8f3QdK7e7/PLf+/w+PedrpPLPig7U7+jsDAMQAEgZWffpZs+/faBo1MTJvU38X1xJu1vEvsbhI4OPxLijTj5XYdj4l0vPHD5Zm9ozEzMLADAscNFC9prtvWwspubq95u/ebLjc+tWvVcKv4HtiY3N6O+fP2FjtNrQ83f/jXQeW4Df+G0PQgA7HCIzExXB4UuBwOAiIjLjxUW/GRkwjziIKrOdb3/Wemp5xcuzK/tSyUAOJ2AxWJRNm+2Dp8w3DxbUdXA9qPn3sz9y7p2Pl6g2VXbkz58qGnzkGTpTlJDCAbCIETUBg8a89+VxxUUvNBNRHzNlDGDAIdAZFGrTr5bcvPoxN93tniUqvMdiyZPW5gHAOxyScjMVIiIma0CYOOjn741oX9KZG/EL7tFkQSFg7fW18lZ985cfNHpXGO+KU0zJtDtGyZJPDHWqL/bKEVGDxkSh7KjTbY77nvZvil/WXrOU3Ids00hikIBALhcLgkATpYV5rN/F3trtwT37cq7PwrWJVmtVuGK1Lqs0fcPvL6vfP+yN/rmT+61bTi2d+XW65BT2lG87M6qw7lbju57pePjt1b1+/zvq7Ndu1bnAYDDEY28FCVYllzqKp41ZlT/BYHuXpw62zr/rulPb2cu0BBlRX7kOjODAaDLJ1d3tUcOMh/XEP0s4gtoDumNwkIAUF1WCZlQ3W4IADAtyy7fN3vJYQCHCwuX/LK5rmPg1FRTx7iRQ5/6bPsrH9xzv+UgOxwimJmKitamNFRt7WDfDj5xeOPmaGSOa27AVwKA227L0byy+HEzAOzd8bch35bmNx3YvfzhPtJe/Y3DkS32cRAA3J+ufp7r8/nb/cu/y8nJiYlSAUD50aI1HNjFdRXvNq1c+UQCMwuXSP5PTyUAHPzszX8/d/KtukN7ViyOzl+Z4qvN5bJKzEwfbn1pzJkjy72BM6/zvo+XPAYAWP+ONbm2sqRV9e3ksgPrl3xP4H9uVOMq0hMBNVXF88tL1xwHgJqaIv2NCu7loADg0M5lucrF17h8v7383nsX6IRb0lJ+m5JsSGqu9/gPf3X8HQbI5narN4rKJWecnjUnyAyoPTTKqI/VZs+3xqanzwlG9xSNwvX8ZLqhMjPVtoY217X4ggmxwq2zsqVJqDxe5OTATrX6m037Ly14zXBbrVbh8vxPnW3Vf+ku/H11+dtl/gtF3Hu+gM9/8+apo66Cx7PnW2Mvb0FXn9IfnkXnT+x7+UDo3Kt8aPefc6VYg/YnkFXy+XqPReuRWwCgXvlRBhFZFLsdWLnyjYS7p2r/MMAk5qSlGMZCw6g+29TIgHBTemJGepK6/tVHkhYuyv7rWyeOG4uJLK0/FNQKvqKxuiEwg792SV+KovhzDdFkSVUCgxHSwu9TzxOBXS43+upCdvYPDrZuzRuRMTJ2rjmGZ6elmQYhHERdfdv5Fm9403uf1L9pIhKm/0p9bECc9MfBabGj0gZqVif1633muGt1cfl3wSIiy+m+DTqdlWSxOBU3gCwCH97FFYGgAr0GqZIoRLSKqkIV2AcAZ840ETMTESkAsHPn5n8bOUD3qDkufH9yalw/9gVxsbr1m3qPf91qR9W2HYWFPX0btq/B8scXP75u9s+Hzk4yi3MHJOtvGZ6qfSE+JvLksb2rHDXeyEail77q46LbZgMA1Hu6PDcNioeGlVhJUaASVBGSSgCQkzNQISIuPVgyIzVBfDLOELnHnBoDv0dFdXVLaW1D16a58/c4Ll48ECQApxxWbSUqFQAYi7HiOIvduyEXf0ubNKlg0/OZlrTkfo+lxGkmpQ/SzklqCM05uc++q7VbXktEu5mhwA6AI2FVVcAsqBJDahIEDCFW4wEgvyQ+tuJoccGwNM3MmBigs132n69s3ll50bP217+1HrqClADGWezhy6a+lxT1R44Epv/XkWIAxTu2vHjn4IHSfLOBZgxP0U5PMGH6kT1LHfn53nnAG91xRmOSXiMgLMs+qTcYqoImbkiMzjiaAIwx8z1jJ8TPRHsHKk53na5v8a+tb2h0DzSbwwd2r5oQjgRFOaIqkigyAMhKkBRFJOCHDiOqCkcBqyJBUAKhztbSr0IrBqaY9g9KEJ65OTVmzPhRBktDe/AjANsSDNqhWg2jN6BUS76e3qOIBO82aOkOBoROj/fQd+W1DoMkjAiEFG9yku7XqQnDHlJkFUSkKKwnQAU42plZlaCyKjBrVFajdYdUGWAGMwCoMMWYxBSzAhXoicjc0OANdQUaww3+3sBhAJARuE2RDQgG8IV0oS3y8ZCW7hcS+qnjHFte+anloT9/DeAB/D/ZggV5Or3YeGdDc3fkH2eCO4SZM1864e3wlyYmxQojBomLrFarwDVF+r5+RkT4vxxRVWoVLkkY+uXEjqnpabGDmr3+nYvs66sFAKhtVV/r6fZRvIl+k2LSDKT0OUEiUt1um7h//1Jp6dKlwiV5i//tcDotApFdXVeBxLmLrBlp8fITfr8fNU3+5QRAYodDpN9ZPj1xcPWnJj3+46TriPcj5xuZrXWR01lZzzR930kJUFWHCHcF2dxQr3druJE5HNmixeJUVq16rl+cXpw1bXSodnCa9r6vyj0b5i54+wQ7HKJkq6hgZqbijS8+OnJEv89uzsriQebwPVPGmz6aMnndhy1t/r3NPip98MFn6/6lm8I1exYIbqtIWXbZ4ciNM1PPlpqGno1Tfiq9fqHeW/mnrdVPOxzZIrIt0WJotVoFu92ubshbMbY3Em5NTOzW/WJ8Sn1SnBH+sIqunqDPH8SZcFg5bdDHnDtW0f3FrHlLDjAzriXUL2/ImZkQsrLsMgDs2fKXiWYj3q9o7Fw2foTpV1pJyXJ+Xjvh5dXvX1i6NIrhilsHETERwAwc/fzl7TcPj/1PX2evLAqCTqcjqERo9LDr9AV5UXrGgFMA0PNJI3syKhkAKirGUmZm1N+0aXaZL0F9aIHV9KdfYKk2pvfRqrPdTw0bkjxFL0VmfHGg4Y5FuSXVfan8kRa3Wq1CRkYGPWCxKFs3vHTr5J8Zv5akEMIhCQatoLT7Is1fng7PnjdvhftfSdXbm57PGN6f/xBn8j8hQ2w/V+OzD0qNtzAUQ15J2e+cziMdl4O57lWaHQ6RLBbl0Ecv5o0f2/+p1o4ORavRi3EGCb0RBa3tkTOhiOFQT6j365a2zubebtkbVlWON+v7p8THJhtJvp3U4OT4hJhxiupHqyfyzlmP5uTQZON0oGPPtPs3ren7d0BXHQ66vla20axZ5wzPPpxeGVbU5vq2jldHpiTkSCRPTorXGWN0AmRFgD8kIxyWAajQaQgaUYA/GEFre1dnOKT74FSj7pBo1BmTtX6dpzOwdc6T65ujGsvORPgR/66pnYmIHY5soaTE2TvjrqcfBvSjZj68wQnAue71R8aMGZY0RUPdt4skpioqDVRVWdKIkicUDnuI6Gxbm1r24T96yt7b8J538eJnRt0yRPDMmPuat09LE0VJfi37by8XHkeQRobBAAAAAElFTkSuQmCC" alt="" style={{width:"18px",height:"18px",objectFit:"contain"}}/>;

const PLATFORM_ICONS = { tiktok:'TikTok', instagram:'Instagram', youtube:'YouTube', threads:'Threads', twitter:'Twitter', reddit:'Reddit', vimeo:'Vimeo' };
const PLATFORM_LABELS = { tiktok:'TikTok', instagram:'Instagram', youtube:'YouTube', threads:'Threads', twitter:'X', reddit:'Reddit', vimeo:'Vimeo' };

// CTA copy per category. Detail-view primary button uses these.
const CTA_LABELS = {
  clothing:    'Reserve',
  essentials:  'Order Now',
  meals:       'Order Now',
  snacks:      'Order Now',
  favorites:   'View Local Pick',
  experiences: 'Book Experience',
  curators:    'Book Curator',
  hotels:      'Open Concierge'
};

function formatCount(n){
  if (n == null) return '';
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(n);
}
function relativeTime(iso){
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days < 7) return days + 'd ago';
  if (days < 30) return Math.floor(days / 7) + 'w ago';
  if (days < 365) return Math.floor(days / 30) + 'mo ago';
  return Math.floor(days / 365) + 'y ago';
}

const CITIES = [
  { id:'savannah', name:'Savannah', region:'Georgia', delivery:'sameday', deliveryLabel:'Same day', temp:'72°F', hotel:'The Alida',
    curator:{ name:'Jasmine L.', role:'Savannah Insider', rating:'4.9', reviews:'128', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces' } },
  { id:'atlanta', name:'Atlanta', region:'Georgia', delivery:'sameday', deliveryLabel:'Same day', temp:'68°F', hotel:'Hotel Clermont',
    curator:{ name:'Marcus D.', role:'Atlanta Insider', rating:'4.8', reviews:'94', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces' } },
  { id:'tampa', name:'Tampa', region:'Florida', delivery:'sameday', deliveryLabel:'Same day', temp:'81°F', hotel:'Tampa EDITION',
    curator:{ name:'Sofia R.', role:'Tampa Insider', rating:'4.9', reviews:'112', avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces' } },
  { id:'orlando', name:'Orlando', region:'Florida', delivery:'days3', deliveryLabel:'Under 3 days', temp:'79°F', hotel:'Waldorf Astoria',
    curator:{ name:'Elena V.', role:'Orlando Insider', rating:'4.8', reviews:'87', avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces' } },
  { id:'miami', name:'Miami', region:'Florida', delivery:'days3', deliveryLabel:'Under 3 days', temp:'84°F', hotel:'Faena Hotel',
    curator:{ name:'Camila P.', role:'Miami Insider', rating:'5.0', reviews:'63', avatar:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces' } },
  { id:'nashville', name:'Nashville', region:'Tennessee', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'charleston', name:'Charleston', region:'South Carolina', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'chicago', name:'Chicago', region:'Illinois', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'dallas', name:'Dallas', region:'Texas', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'houston', name:'Houston', region:'Texas', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'denver', name:'Denver', region:'Colorado', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'phoenix', name:'Phoenix', region:'Arizona', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'losangeles', name:'Los Angeles', region:'California', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'sandiego', name:'San Diego', region:'California', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'seattle', name:'Seattle', region:'Washington', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'saltlake', name:'Salt Lake City', region:'Utah', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'columbus', name:'Columbus', region:'Ohio', delivery:'days7', deliveryLabel:'7-day advance', limited:true },
  { id:'newyork', name:'New York', region:'New York', delivery:'days3', deliveryLabel:'Under 3 days', limited:true },
  { id:'washington', name:'Washington', region:'D.C.', delivery:'days3', deliveryLabel:'Under 3 days', limited:true },
  { id:'caribbean', name:'Caribbean', region:'Coming soon', soon:true }
];

// ── Search categories (drives UI grouping + icons) ───────────────────────────
const CATEGORIES = {
  essentials:    { label:'Essentials',       icon:'Bottle'    },
  clothing:      { label:'Clothing Rentals', icon:'Hanger'    },
  meals:         { label:'Arrival Meals',    icon:'Dome'      },
  snacks:        { label:'Snacks & Drinks',  icon:'Cup'       },
  favorites:     { label:'Local Favorites',  icon:'Sparkles'  },
  social:        { label:'From Social',      icon:'Play'      },
  experiences:   { label:'Experiences',      icon:'Compass'   },
  curators:      { label:'Curators',         icon:'Person'    },
  hotels:        { label:'Hotels',           icon:'Building'  }
};
const CATEGORY_ORDER = ['essentials','clothing','meals','snacks','favorites','social','experiences','curators','hotels'];

// ── Suggested searches (Phase 1: static; later: from search_queries table) ──
// ── Suggested searches (Phase 1: static; later: from search_queries table) ──
// Dynamic so they mention the user's current city.
function getSuggested(city){
  return [
    { q:'I forgot SPF',                              icon:'Sparkles' },
    { q:'Dinner outfit',                             icon:'Sparkles' },
    { q:'Arrival meals in ' + city.name,             icon:'Dome'     },
    { q:'Where locals go in ' + city.name,           icon:'Sparkles' },
    { q:'Hotel essentials',                          icon:'Bottle'   },
    { q:'Trending on TikTok',                        icon:'Play'     },
    { q:'Experiences near my hotel',                 icon:'Compass'  }
  ];
}

// ── Supabase config ────────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://vkctidpaghpdlmleezvq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3RpZHBhZ2hwZGxtbGVlenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI5MjgsImV4cCI6MjA5MDg5ODkyOH0.wKtG6XD6CwLy3rJDZc4S10-NqNr3fcCXHYOWJt_C628';

// Anthropic requests go through the Supabase Edge Function "concierge" so the
// API key stays server-side. (Deploy: supabase functions deploy concierge)
const CLAUDE_PROXY_URL = SUPABASE_URL + '/functions/v1/concierge';

// Shared helper: send a messages request to Claude via the proxy.
// Returns the parsed JSON (same shape as the Anthropic API response).
async function callClaude(payload) {
  const res = await fetch(CLAUDE_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'apikey': SUPABASE_ANON_KEY
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Proxy HTTP ' + res.status);
  return res.json();
}

async function fetchSearchableContent() {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/searchable_content?select=*&order=popularity_score.desc&limit=500',
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty response');
    return data.map(function(row) {
      return Object.assign({}, row, {
        tags: Array.isArray(row.tags) ? row.tags
              : typeof row.tags === 'string' ? row.tags.split(',').map(function(t){ return t.trim(); })
              : []
      });
    });
  } catch(e) {
    console.warn('[BagFree] Supabase fetch failed, using seed data:', e.message);
    return null;
  }
}

// ── Supabase live search (queries DB directly for real-time results) ────────────────────
async function supabaseSearch(query, cityId) {
  try {
    // Build a PostgREST full-text / ilike search across title, description, tags
    const q = encodeURIComponent('%' + query + '%');
    const cityFilter = cityId ? '&or=(city.eq.' + cityId + ',city.eq.all)' : '';
    const url = SUPABASE_URL + '/rest/v1/searchable_content?select=*' + cityFilter +
                '&or=(title.ilike.' + q + ',description.ilike.' + q + ')' +
                '&order=popularity_score.desc&limit=100';
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.map(function(row) {
      return Object.assign({}, row, {
        tags: Array.isArray(row.tags) ? row.tags
              : typeof row.tags === 'string' ? row.tags.split(',').map(function(t){ return t.trim(); })
              : []
      });
    });
  } catch(e) {
    return null;
  }
}

// ── Seed data (fallback if Supabase is unreachable or table is empty) ───────────────────────
const SEED_SEARCHABLE = [
  // ── Essentials ──
  { id:'e001', title:'Toiletry Restock Kit', description:'Forget toothpaste, deodorant, razors? Restock kit delivered in 90 minutes.',
    category:'essentials', city:'savannah', region:'Georgia', tags:['toiletries','toothbrush','deodorant','razor','shampoo'],
    image_url:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_bf_essentials',
    popularity_score:88, freshness_score:95, conversion_score:82 },
  { id:'e002', title:'Phone Charger + Cable Pack', description:'USB-C and Lightning cables plus 20W charger. Same-day to your room.',
    category:'essentials', city:'all', region:'All', tags:['charger','cable','usb','phone','tech'],
    image_url:'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_bf_essentials',
    popularity_score:74, freshness_score:88, conversion_score:79 },
  { id:'e003', title:'Sunscreen + Beach Basics', description:'Reef-safe sunscreen, after-sun, lip balm, hat. Florida summer ready.',
    category:'essentials', city:'tampa', region:'Florida', tags:['sunscreen','beach','spf','summer'],
    image_url:'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_bf_essentials',
    popularity_score:81, freshness_score:90, conversion_score:84 },

  // ── Clothing rentals & purchases ──
  { id:'c001', title:'3-Day Womens Wardrobe', description:'Pick 4 pieces (dresses, blouses, blazers). Rental or buy at checkout.',
    category:'clothing', city:'all', region:'All', tags:['rental','3-day','women','dress','wardrobe'],
    image_url:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    destination_url:'/departure-lounge-landing.html', partner_id:'p_departure_lounge',
    popularity_score:92, freshness_score:88, conversion_score:81 },
  { id:'c002', title:'Mens Suit Rental', description:'Curated business or black-tie suit, tailored, delivered to your hotel.',
    category:'clothing', city:'all', region:'All', tags:['rental','men','suit','formal','business'],
    image_url:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=400&fit=crop',
    destination_url:'/departure-lounge-landing.html', partner_id:'p_departure_lounge',
    popularity_score:78, freshness_score:85, conversion_score:74 },
  { id:'c003', title:'Resort Wear Collection', description:'Linen, kaftans, swim and pool-side looks for warm weather travel.',
    category:'clothing', city:'miami', region:'Florida', tags:['resort','linen','swim','beach','pool'],
    image_url:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop',
    destination_url:'/departure-lounge-landing.html', partner_id:'p_departure_lounge',
    popularity_score:85, freshness_score:92, conversion_score:80 },

  // ── Arrival meals ──
  { id:'m001', title:'Welcome to Savannah Dinner', description:'Low-country boil for two from The Grey, delivered hot on arrival.',
    category:'meals', city:'savannah', region:'Georgia', tags:['dinner','southern','boil','arrival','the-grey'],
    image_url:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_the_grey',
    popularity_score:91, freshness_score:94, conversion_score:86 },
  { id:'m002', title:'Cuban Sandwich Lunch Drop', description:'Authentic prensado from Columbia Restaurant, Ybor City. Delivered to your room.',
    category:'meals', city:'tampa', region:'Florida', tags:['lunch','cuban','sandwich','columbia','ybor'],
    image_url:'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_columbia',
    popularity_score:84, freshness_score:90, conversion_score:79 },
  { id:'m003', title:'Late-Night Atlanta Breakfast', description:'Waffle House classic plate delivered after 11pm.',
    category:'meals', city:'atlanta', region:'Georgia', tags:['breakfast','late-night','waffle','classic'],
    image_url:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_waffle_house',
    popularity_score:69, freshness_score:82, conversion_score:71 },

  // ── Snacks & drinks ──
  { id:'s001', title:'Savannah Snack Box', description:'Pralines, benne wafers, sweet tea — Southern essentials curated by locals.',
    category:'snacks', city:'savannah', region:'Georgia', tags:['snack','praline','southern','tea','local'],
    image_url:'/snacks-card.jpg',
    destination_url:'/legacy.html#essentials', partner_id:'p_savannah_market',
    popularity_score:79, freshness_score:88, conversion_score:76 },
  { id:'s002', title:'Florida Citrus & Wine Pairing', description:'Local citrus assortment with a curated Florida wine.',
    category:'snacks', city:'orlando', region:'Florida', tags:['wine','citrus','fruit','pairing','florida'],
    image_url:'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_florida_market',
    popularity_score:71, freshness_score:84, conversion_score:73 },
  { id:'s003', title:'Sweet Tea Cocktail Kit', description:'Bourbon, sweet tea concentrate, lemon, mint. Mix in your room.',
    category:'snacks', city:'savannah', region:'Georgia', tags:['cocktail','bourbon','tea','mint','kit'],
    image_url:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop',
    destination_url:'/legacy.html#essentials', partner_id:'p_savannah_bar',
    popularity_score:82, freshness_score:91, conversion_score:78 },

  // ── Local favorites ──
  { id:'f001', title:'Forsyth Park Sunrise Walk', description:'Picked by locals: a quiet hour at the fountain before the crowds arrive.',
    category:'favorites', city:'savannah', region:'Georgia', tags:['park','sunrise','walk','locals','quiet'],
    image_url:'https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_local_savannah',
    popularity_score:88, freshness_score:93, conversion_score:71 },
  { id:'f002', title:'Buckhead Hidden Speakeasies', description:'Three under-the-radar bars curators send their friends to.',
    category:'favorites', city:'atlanta', region:'Georgia', tags:['nightlife','bars','speakeasy','buckhead','hidden'],
    image_url:'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_local_atlanta',
    popularity_score:76, freshness_score:88, conversion_score:69 },

  // ── Experiences ──
  { id:'x001', title:'Savannah Ghost Walk', description:'90-minute curated walking tour through the historic district. Small groups.',
    category:'experiences', city:'savannah', region:'Georgia', tags:['tour','ghost','walk','historic','night'],
    image_url:'https://images.unsplash.com/photo-1568854728811-bc4ac9b9c5b4?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_savannah_tours',
    popularity_score:86, freshness_score:90, conversion_score:81 },
  { id:'x002', title:'Tybee Island Day Sail', description:'Half-day private charter, dolphins, sunset return. Captain-led.',
    category:'experiences', city:'savannah', region:'Georgia', tags:['sail','boat','tybee','charter','sunset'],
    image_url:'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_tybee_charter',
    popularity_score:81, freshness_score:87, conversion_score:78 },
  { id:'x003', title:'Tampa Riverwalk Food Crawl', description:'Three-stop guided tasting tour along the Hillsborough Riverwalk.',
    category:'experiences', city:'tampa', region:'Florida', tags:['food','tour','riverwalk','tasting','guided'],
    image_url:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_tampa_tours',
    popularity_score:74, freshness_score:85, conversion_score:72 },

  // ── Curators ──
  { id:'cu001', title:'Jasmine L. — Savannah Insider', description:'Born and raised. 4.9 stars across 128 trips. Books out 2 weeks ahead.',
    category:'curators', city:'savannah', region:'Georgia', tags:['curator','insider','savannah','top-rated'],
    image_url:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_curator_jasmine',
    popularity_score:94, freshness_score:96, conversion_score:88 },
  { id:'cu002', title:'Marcus D. — Atlanta Insider', description:'Music, food, neighborhoods. 4.8 stars from 94 travelers.',
    category:'curators', city:'atlanta', region:'Georgia', tags:['curator','atlanta','music','food'],
    image_url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_curator_marcus',
    popularity_score:85, freshness_score:91, conversion_score:80 },
  { id:'cu003', title:'Sofia R. — Tampa Insider', description:'Cuban heritage, hidden Ybor gems, beach access tips. 4.9 stars.',
    category:'curators', city:'tampa', region:'Florida', tags:['curator','tampa','cuban','beach'],
    image_url:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop',
    destination_url:'/curators.html', partner_id:'p_curator_sofia',
    popularity_score:82, freshness_score:90, conversion_score:78 },

  // ── Hotels ──
  { id:'h001', title:'The Alida, Savannah', description:'Boutique riverfront. BagFree integrated room concierge. Preferred partner.',
    category:'hotels', city:'savannah', region:'Georgia', tags:['hotel','boutique','riverfront','alida','luxury'],
    image_url:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
    destination_url:'/concierge.html', partner_id:'p_alida',
    popularity_score:90, freshness_score:92, conversion_score:84 },
  { id:'h002', title:'Hotel Effie, Sandestin', description:'Gulf coast luxury with full BagFree menu. Spa partnerships.',
    category:'hotels', city:'all', region:'Florida', tags:['hotel','gulf','spa','luxury','sandestin'],
    image_url:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    destination_url:'/concierge.html', partner_id:'p_effie',
    popularity_score:78, freshness_score:86, conversion_score:75 },

  // ── Social mentions (indexed from TikTok / Instagram / YouTube / Threads) ──
  { id:'soc001', title:"5 Savannah ghost stories locals don't tell tourists",
    description:"60-second walk through River Street with a Savannah-born guide. Pin in description.",
    category:'social', city:'savannah', region:'Georgia',
    tags:['ghost','tour','river-street','savannah','tiktok','locals'],
    image_url:'https://images.unsplash.com/photo-1568854728811-bc4ac9b9c5b4?w=800&h=600&fit=crop',
    destination_url:'https://www.tiktok.com/@elegantsavannah/video/example001',
    partner_id:'p_social_organic',
    platform:'tiktok', creator_handle:'@elegantsavannah',
    view_count:1240000, like_count:89000, posted_at: new Date(Date.now() - 4*864e5).toISOString(),
    popularity_score:89, freshness_score:96, conversion_score:64 },

  { id:'soc002', title:'Best brunch spots in Buckhead this month',
    description:"Three-place tour I'd send my best friend to. Atlanta locals approved.",
    category:'social', city:'atlanta', region:'Georgia',
    tags:['brunch','buckhead','atlanta','food','instagram','reel'],
    image_url:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
    destination_url:'https://www.instagram.com/reel/example002',
    partner_id:'p_social_organic',
    platform:'instagram', creator_handle:'@atlantaeats',
    view_count:412000, like_count:31500, posted_at: new Date(Date.now() - 9*864e5).toISOString(),
    popularity_score:78, freshness_score:90, conversion_score:58 },

  { id:'soc003', title:'Tampa Riverwalk in 60 seconds',
    description:'Quick walking tour of the Hillsborough Riverwalk with my favorite three stops.',
    category:'social', city:'tampa', region:'Florida',
    tags:['riverwalk','tampa','tour','youtube','shorts'],
    image_url:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    destination_url:'https://www.youtube.com/shorts/example003',
    partner_id:'p_social_organic',
    platform:'youtube', creator_handle:'@tampaviews',
    view_count:285000, like_count:14200, posted_at: new Date(Date.now() - 12*864e5).toISOString(),
    popularity_score:71, freshness_score:86, conversion_score:52 },

  { id:'soc004', title:'Where I take my friends for low-country dinner',
    description:"The Grey is everyone's pick. Here's what to actually order.",
    category:'social', city:'savannah', region:'Georgia',
    tags:['dinner','the-grey','savannah','food','instagram','low-country'],
    image_url:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    destination_url:'https://www.instagram.com/p/example004',
    partner_id:'p_social_organic',
    platform:'instagram', creator_handle:'@savannahbites',
    view_count:198000, like_count:18900, posted_at: new Date(Date.now() - 21*864e5).toISOString(),
    popularity_score:74, freshness_score:78, conversion_score:61 },

  { id:'soc005', title:'Hidden speakeasies in South Beach',
    description:'Three bars locals send their friends to. Number 2 changed me.',
    category:'social', city:'miami', region:'Florida',
    tags:['speakeasy','south-beach','miami','nightlife','tiktok','bars'],
    image_url:'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop',
    destination_url:'https://www.tiktok.com/@miamilatenights/video/example005',
    partner_id:'p_social_organic',
    platform:'tiktok', creator_handle:'@miamilatenights',
    view_count:670000, like_count:52000, posted_at: new Date(Date.now() - 6*864e5).toISOString(),
    popularity_score:82, freshness_score:93, conversion_score:56 },

  { id:'soc006', title:'Why Atlanta is the most underrated weekend trip',
    description:'Threads thread on why ATL deserves more than a layover. 47 places linked.',
    category:'social', city:'atlanta', region:'Georgia',
    tags:['atlanta','weekend','threads','underrated','travel'],
    image_url:'https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&h=600&fit=crop',
    destination_url:'https://www.threads.net/@atltravelclub/post/example006',
    partner_id:'p_social_organic',
    platform:'threads', creator_handle:'@atltravelclub',
    view_count:92000, like_count:4800, posted_at: new Date(Date.now() - 15*864e5).toISOString(),
    popularity_score:65, freshness_score:80, conversion_score:48 }
];

// Active searchable data - starts as seed, gets replaced by Supabase on load
let SEARCHABLE = SEED_SEARCHABLE.slice();

// ── Semantic intent (Phase 2.1 client shim) ─────────────────────────────────
// Maps natural-language phrasings to canonical search tokens so queries like
// "I forgot SPF", "dinner outfit", or "where locals go" actually return the
// right items. Phase 2.2 will replace this with real pgvector embeddings via
// bf_search_hybrid — the front-end contract stays identical.
const CONCEPTS = [
  { triggers:['spf','sun protection','sunblock','sunburn','forgot sunscreen','beach essentials','avoid burning'],
    expansion:'sunscreen beach spf summer' },
  { triggers:['dinner outfit','something to wear','nice clothes','fancy clothes','formal','black tie','dressed up'],
    expansion:'dress wardrobe rental clothing formal suit' },
  { triggers:['where locals go','hidden gems','local favorite','locals love','off the beaten path','authentic'],
    expansion:'local hidden curator favorite insider' },
  { triggers:['hungry','what to eat','where to eat','need food','grab a bite'],
    expansion:'meal food dinner brunch arrival' },
  { triggers:['charge','charger','battery','phone died','dead phone','cable'],
    expansion:'charger cable usb phone tech' },
  { triggers:['after dark','nightlife','late night','bars','speakeasy','drinks tonight'],
    expansion:'speakeasy bar cocktail nightlife bourbon' },
  { triggers:['vacation outfit','beach clothes','resort wear','warm weather'],
    expansion:'resort linen swim beach pool' },
  { triggers:['history','historic','haunted','ghosts','ghost tour'],
    expansion:'ghost historic tour walking river' },
  { triggers:['romantic','date night','special occasion','anniversary'],
    expansion:'dinner wine sunset cocktail experience' },
  { triggers:['kids','family friendly','with kids','toddler','children'],
    expansion:'park family experience walk' },
  { triggers:['hangover','rough morning','cure'],
    expansion:'breakfast coffee brunch waffle' },
  { triggers:['instagram','photo','photogenic','scenic','aesthetic'],
    expansion:'park fountain sunset scenic riverwalk' },
  { triggers:['cocktail','mixed drink','happy hour','wine night'],
    expansion:'cocktail bourbon wine tea kit pairing' },
  { triggers:['trending','popular','going viral','whats hot','everyone is talking about'],
    expansion:'trending tiktok social viral' },
  { triggers:['help me plan','plan my trip','what should i do','concierge'],
    expansion:'curator concierge insider experiences favorites' },
  { triggers:['arriving','just landed','first day','arrival'],
    expansion:'arrival meal essentials welcome' },
  { triggers:['leaving','last day','departure','one more night'],
    expansion:'experience favorite curator hotel' },
  { triggers:['toiletries','forgot','missed packing','restock','ran out'],
    expansion:'toiletries restock essentials toothbrush deodorant' },
  { triggers:['real food','comfort food','homesick','southern'],
    expansion:'southern dinner low-country boil comfort' }
];

function expandQuery(qRaw) {
  const q = (qRaw || '').trim().toLowerCase();
  if (!q) return { original: qRaw, expanded: '', applied: false, matched: [] };
  const matched = [];
  const additions = [];
  for (let i = 0; i < CONCEPTS.length; i++) {
    const c = CONCEPTS[i];
    for (let j = 0; j < c.triggers.length; j++) {
      if (q.indexOf(c.triggers[j]) >= 0) {
        matched.push(c.triggers[j]);
        additions.push(c.expansion);
        break;
      }
    }
  }
  if (additions.length === 0) {
    return { original: qRaw, expanded: qRaw, applied: false, matched: [] };
  }
  return {
    original: qRaw,
    expanded: qRaw + ' ' + additions.join(' '),
    applied: true,
    matched: matched,
    expansion: additions.join(', ')
  };
}

// ── Ranking (Phase 1: client-side; mirror this in a Postgres view later) ────
function computeRealityRank(item){
  // Phase 1 placeholder: weighted average of popularity, conversion, freshness.
  // Future: + verified outcomes, curator trust, repeat visits, regret score.
  return Math.round(item.popularity_score * 0.4 + item.conversion_score * 0.4 + item.freshness_score * 0.2);
}
// Common English stopwords + question words that shouldn't drive product matches
var SEARCH_STOPWORDS = {
  'a':1,'an':1,'and':1,'are':1,'as':1,'at':1,'be':1,'by':1,'for':1,'from':1,'how':1,
  'in':1,'is':1,'it':1,'of':1,'on':1,'or':1,'the':1,'to':1,'was':1,'what':1,'when':1,
  'where':1,'which':1,'who':1,'why':1,'will':1,'with':1,'i':1,'me':1,'my':1,'do':1,
  'does':1,'can':1,'you':1,'your':1,'this':1,'that':1,'near':1,'get':1,'got':1,'now':1,
  'current':1,'currently':1,'time':1,'today':1,'uk':1,'us':1
};

function rankResults(query, cityId, items){
  const original = (query || '').trim();
  const exp = expandQuery(original);
  // Use the expanded query for matching, but keep original for display.
  const q = (exp.expanded || '').trim().toLowerCase();
  // Tokenise into meaningful words: length >= 3, not a stopword
  const allWords = q.split(/[^a-z0-9]+/).filter(Boolean);
  const words = allWords.filter(function(w){ return w.length >= 3 && !SEARCH_STOPWORDS[w]; });
  // How many distinct query words exist (used to require a minimum match ratio)
  const ranked = items
    .map(function(it){
      // Build a haystack of discrete, lowercased words for whole-word matching
      const haystackWords = (it.title + ' ' + it.description + ' ' + (it.tags || []).join(' ') + ' ' + it.city + ' ' + it.category)
        .toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      const haystackSet = {};
      haystackWords.forEach(function(hw){ haystackSet[hw] = 1; });

      let kw = 0, hits = 0;
      words.forEach(function(w){
        if (haystackSet[w]) {
          // Whole-word match: strong signal
          kw += 25; hits++;
        } else if (w.length >= 5 && haystackWords.some(function(hw){ return hw.length >= 5 && (hw.indexOf(w) >= 0 || w.indexOf(hw) >= 0); })) {
          // Partial match only between two substantial words (both >=5 chars), e.g.
          // "sunscreen" <-> "sunscreens". The length floor prevents "london"~"on".
          kw += 10; hits++;
        }
      });
      const cityMatch = (cityId && (it.city === cityId || it.city === 'all')) ? 30 : 0;
      const realityRank = computeRealityRank(it);
      const score = kw + cityMatch + realityRank * 0.6;
      return Object.assign({}, it, { _score:score, _kw:kw, _hits:hits, reality_rank_score: computeRealityRank(it) });
    })
    // Require at least one real keyword hit. If the query had NO meaningful words
    // at all (e.g. only stopwords like "what is the time"), match nothing.
    .filter(function(it){ return words.length > 0 && it._hits > 0; })
    .sort(function(a,b){ return b._score - a._score; });
  // Attach expansion metadata so callers can show the "Smart match" hint
  ranked.expansion = exp.applied ? exp : null;
  return ranked;
}

// ── Analytics (Phase 1: localStorage + console; later: POST to /api/events) ─
// Keys whose values may contain user-typed free text — redacted before being
// persisted to localStorage so no personal info is stored at rest.
var SENSITIVE_ANALYTICS_KEYS = { q:1, seed:1, query:1, message:1, text:1 };

function track(event, data){
  const payload = Object.assign({ event:event, ts:new Date().toISOString() }, data || {});
  try {
    // Build a redacted copy for storage: keep the fact a field was present and
    // its length, but not the raw text.
    const safe = {};
    Object.keys(payload).forEach(function(k){
      if (SENSITIVE_ANALYTICS_KEYS[k] && typeof payload[k] === 'string') {
        safe[k] = '[redacted:' + payload[k].length + ']';
      } else {
        safe[k] = payload[k];
      }
    });
    const log = JSON.parse(localStorage.getItem('bf_events') || '[]');
    log.push(safe);
    if (log.length > 500) log.shift();
    localStorage.setItem('bf_events', JSON.stringify(log));
  } catch(e) {}
  // Full payload still goes to the console for live debugging (not persisted).
  if (window.console && console.log) console.log('[analytics]', payload);
  // TODO Phase 2: POST to a server endpoint over HTTPS instead of localStorage.
}

// ── Recent searches (localStorage-backed; Phase 2 will read from user's
// search_queries table once auth lands) ────────────────────────────────────
const RECENT_KEY = 'bf_recent_searches';
const RECENT_MAX = 5;

function getRecent(){
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}
function pushRecent(q){
  const trimmed = (q || '').trim();
  if (!trimmed) return;
  const list = getRecent().filter(function(x){ return x.toLowerCase() !== trimmed.toLowerCase(); });
  list.unshift(trimmed);
  const capped = list.slice(0, RECENT_MAX);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(capped)); } catch(e) {}
  return capped;
}
function removeRecent(q){
  const list = getRecent().filter(function(x){ return x !== q; });
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch(e) {}
  return list;
}
function clearRecent(){
  try { localStorage.removeItem(RECENT_KEY); } catch(e) {}
  return [];
}

// ── URL routing (lightweight, no router lib) ────────────────────────────────
// Encodes: q (search query), city (selected city id), view (item id being shown)
function readUrlState(){
  const params = new URLSearchParams(window.location.search);
  return {
    q:    params.get('q')    || '',
    city: params.get('city') || null,
    view: params.get('view') || null
  };
}
function writeUrlState(state, replace){
  const params = new URLSearchParams();
  if (state.q)    params.set('q', state.q);
  if (state.city) params.set('city', state.city);
  if (state.view) params.set('view', state.view);
  const qs = params.toString();
  const url = qs ? (window.location.pathname + '?' + qs) : window.location.pathname;
  try {
    if (replace) window.history.replaceState({}, '', url);
    else         window.history.pushState({}, '', url);
  } catch(e) {}
}

function highlight(text, q){
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return [
    text.slice(0, i),
    <mark key="m">{text.slice(i, i + q.length)}</mark>,
    text.slice(i + q.length)
  ];
}

const NAV = [
  { id:'home',         label:'Home',           icon:Icon.Grid,    href:'/' },
  { id:'plan',         label:'Plan My Trip',   icon:Icon.Map,     href:'/plan-my-trip.html' },
  { id:'clothing',     label:'Clothing',       icon:Icon.Hanger,  href:'/departure-lounge-landing.html' },
  { id:'curators',     label:'Curators',       icon:Icon.Person,  href:'/curators.html' },
  { id:'essentials',   label:'Essentials',     icon:Icon.Bag,     href:'/legacy.html#essentials' },
  { id:'experiences',  label:'Experiences',    icon:Icon.Compass, href:'/experiences.html' },
  { id:'membership',   label:'Membership',     icon:Icon.Crown,   href:'/membership.html' },
  { id:'rewards',      label:'Rewards',        icon:Icon.Star,    href:'/legacy.html#rewards' },
  { id:'secondjourney',label:'Second Journey™',icon:SecondJourneyIcon, href:'/second-journey.html', sage:true },
  { id:'partner',      label:'Partner',        icon:Icon.Gift,    href:'/partners.html' },
];

const TILES = [
  { id:'clothing', title:'Clothing', desc:'Shop or rent for any occasion.', icon:Icon.Hanger, link:'/departure-lounge-landing.html', img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop' },
  { id:'meals', title:'Arrival Meals', desc:'Chef-prepared meals delivered to your hotel.', icon:Icon.Dome, link:'/legacy.html#essentials', img:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop' },
  { id:'secondjourney', title:'Second Journey™', desc:'Rent. Wear. Return. Repeat.', verified:'Professionally laundered, quality inspected, and ready for its next journey.', tealAccent:true, icon:function(){return React.createElement('img',{src:'/images/second-journey-logo.png',style:{width:'72px',height:'72px',objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',marginBottom:'-15px',marginTop:'-15px',marginLeft:'-15px'},alt:'Second Journey'})}, link:'/departure-lounge-landing.html?vendor=second-journey', img:'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=400&fit=crop', badge:'NEW' },
  { id:'curators', title:'Travel Curators', desc:'Local experts. Personalized experiences.', icon:Icon.Person, link:'/curators.html', img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', badge:'NEW' },
  { id:'essentials', title:'Hotel Essentials', desc:'Premium comforts for a seamless stay.', icon:Icon.Bottle, link:'/legacy.html#essentials', img:ESSENTIALS_IMG },
  { id:'experiences', title:'Local Experiences', desc:'Tours, activities and hidden gems.', icon:Icon.Compass, link:'/legacy.html#essentials', img:'https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=600&h=400&fit=crop' },
  { id:'stylepartners', title:'Style Partners', desc:'Local fashion experts. Destination styling.', icon:Icon.Sparkles, link:'/local-style-partners.html', img:'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop' },
  { id:'rewards', title:'BAG Rewards', desc:'Earn points. Unlock exclusive benefits.', icon:Icon.GiftBox, link:'/legacy.html#rewards', img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=400&fit=crop' }
];


const SunSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
const MoonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

function ThemeToggle() {
  const [light, setLight] = React.useState(function(){ try { return localStorage.getItem('bf_theme') === 'light'; } catch(e){ return false; }});
  React.useEffect(function(){
    if (light) { document.documentElement.classList.add('light'); } else { document.documentElement.classList.remove('light'); }
    try { localStorage.setItem('bf_theme', light ? 'light' : 'dark'); } catch(e){}
  }, [light]);
  return (
    <button className="theme-toggle" onClick={function(){ setLight(!light); }} aria-label="Toggle theme">
      <span dangerouslySetInnerHTML={{__html: light ? MoonSVG : SunSVG}}></span>
    </button>
  );
}

function Sidebar(props) {
  const menuState = useState(false);
  const open = menuState[0];
  const setOpen = menuState[1];

  React.useEffect(function(){
    if (!open) return;
    function onDoc(){ setOpen(false); }
    document.addEventListener('click', onDoc);
    return function(){ document.removeEventListener('click', onDoc); };
  }, [open]);

  return (
    <aside className={'sidebar' + (props.mobileOpen ? ' sidebar--open' : '')}>
      <button className="sidebar-close" aria-label="Close menu" onClick={props.onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
      </button>
      <a href="/" className="brand-link" onClick={function(){ if(props.onClose) props.onClose(); }}>
        <img src={LOGO_SRC} alt="BagFree" className="brand-img"/>
      </a>

      <div className="meta-anchor">
        <div className="sidebar-city" onClick={function(e){ e.stopPropagation(); setOpen(!open); }}>
          <div className="sidebar-city-info">
            <div className="sidebar-city-label">Current City</div>
            <div className="sidebar-city-name"><Icon.Pin/> {props.city.name}</div>
          </div>
          <span className="sidebar-city-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 6 15 12 9 18"/></svg>
          </span>
        </div>
        {open ? <CityMenu city={props.city} setCity={props.setCity} close={function(){ setOpen(false); }}/> : null}
      </div>

      <nav className="nav">
        {NAV.map(function(n, idx){
          if (n.type === 'header') {
            return <div key={'hdr-'+n.label} className="nav-section-header">{n.label}</div>;
          }
          const I = n.icon;
          const cls = 'nav-item' + (props.active === n.id ? ' active' : '') + (n.sage ? ' nav-item--sage' : '');
          var navHref = n.href;
          if (n.authRequired) {
            navHref = sbClient ? n.href : '/account-login.html';
          }
          return (
            <a key={n.id} href={navHref} className={cls} onClick={n.authRequired ? function(e) {
              if (!sbClient) return;
              e.preventDefault();
              sbClient.auth.getSession().then(function(res) {
                window.location.href = (res.data && res.data.session) ? n.href : '/account-login.html';
              });
            } : undefined}>
              <I/><span>{n.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="rewards-card">
        <div className="rewards-head"><Icon.Crown/> BAG REWARDS</div>
        <div className="rewards-points">2,450</div>
        <div className="rewards-label">Points Available</div>
        <a href="/legacy.html#rewards" className="rewards-link">
          View Rewards <Icon.ArrowRight/>
        </a>
      </div>
    </aside>
  );
}

function CityMenu(props) {
  var DCOLORS = {sameday:'rgb(77,216,138)', days3:'rgb(232,192,106)', days7:'rgb(168,180,204)'};
  var expandState = React.useState(false);
  var expanded = expandState[0]; var setExpanded = expandState[1];
  var primary = CITIES.filter(function(c){ return !c.limited && !c.soon; });
  var extra = CITIES.filter(function(c){ return c.limited || c.soon; });
  function renderItem(c) {
    var isActive = c.id === props.city.id;
    var cls = 'city-menu-item' + (isActive ? ' active' : '') + (c.soon ? ' disabled' : '');
    var nameColor = c.delivery ? DCOLORS[c.delivery] : 'rgba(253,252,248,0.5)';
    return (
      <button key={c.id} className={cls}
        onClick={function(){ if(!c.soon){ props.setCity(c); props.close(); } }}>
        <span>
          <span style={{color: nameColor}}>{c.name}</span>
          <span className="city-region">{c.region}{c.deliveryLabel ? ' · ' + c.deliveryLabel : ''}{c.limited ? ' · Limited' : ''}</span>
        </span>
        {c.soon
          ? <span className="soon">Soon</span>
          : (isActive ? <span className="tick">✓</span> : null)}
      </button>
    );
  }
  return (
    <div className="city-menu" onClick={function(e){ e.stopPropagation(); }}>
      {primary.map(renderItem)}
      <button className="city-menu-expand" onClick={function(){ setExpanded(!expanded); }}>
        <span>{expanded ? 'Show fewer cities' : 'All cities (' + extra.length + ' more)'}</span>
        <span style={{fontSize:'0.7rem',transition:'transform 0.2s',display:'inline-block',transform:expanded?'rotate(180deg)':'none'}}>▾</span>
      </button>
      {expanded && extra.map(renderItem)}
    </div>
  );
}

function SearchBar(props) {
  const qState = useState('');
  const q = qState[0]; const setQ = qState[1];
  const focusState = useState(false);
  const focused = focusState[0]; const setFocused = focusState[1];
  const hiState = useState(-1);
  const hi = hiState[0]; const setHi = hiState[1];
  const recentState = useState(getRecent());
  const recents = recentState[0]; const setRecents = recentState[1];
  const loadingState = useState(false);
  const loading = loadingState[0]; const setLoading = loadingState[1];
  const wrapRef = React.useRef(null);

  React.useEffect(function(){
    function onDoc(e){
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    }
    document.addEventListener('mousedown', onDoc);
    return function(){ document.removeEventListener('mousedown', onDoc); };
  }, []);

  const live = q.trim() ? rankResults(q, props.city.id, SEARCHABLE).slice(0, 6) : [];
  const showDrop = focused && !loading;
  const suggestions = getSuggested(props.city);

  // AI-powered query interpretation via Claude API
  async function interpretWithAI(rawQuery) {
    const categoryList = Object.entries(CATEGORIES).map(function([k,v]){ return k + ' (' + v.label + ')'; }).join(', ');
    const tagList = Array.from(new Set(SEARCHABLE.flatMap(function(x){ return x.tags || []; }))).slice(0, 60).join(', ');
    try {
      const data = await callClaude({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: 'You are a search assistant for BagFree, a travel concierge that delivers clothing rentals, meals, essentials, snacks, local favorites, experiences, and social content recommendations to hotel guests. Given a natural-language search query, respond ONLY with a JSON object (no markdown, no extra text) with two fields: "keywords" (3-8 space-separated search keywords that best map the intent to catalog items) and "hint" (a short plain-English note under 12 words explaining what you understood). Available categories: ' + categoryList + '. Common catalog tags: ' + tagList + '. Current city: ' + props.city.name + ', ' + props.city.region + '.',
        messages: [{ role: 'user', content: rawQuery }]
      });
      if (data.content && data.content[0] && data.content[0].text) {
        const cleaned = data.content[0].text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch(e) {}
    return null;
  }

  async function submit(query) {
    const final = (query || q).trim();
    if (!final) return;
    track('search_submit', { q: final, city: props.city.id });
    setLoading(true);
    setFocused(false);

    let searchQuery = final;
    let aiHint = null;

    // Run AI interpretation and Supabase search in parallel
    try {
      const [ai, dbRows] = await Promise.all([
        interpretWithAI(final),
        supabaseSearch(final, props.city.id)
      ]);
      if (ai && ai.keywords) {
        searchQuery = final + ' ' + ai.keywords;
        aiHint = ai.hint || null;
      }
      // If Supabase returned rows, use them as the ranking pool; else fall back to in-memory
      if (dbRows && dbRows.length > 0) {
        // Merge DB results with full SEARCHABLE so local ranking algo can score them
        const dbIds = new Set(dbRows.map(function(r){ return r.id; }));
        const merged = dbRows.concat(SEARCHABLE.filter(function(x){ return !dbIds.has(x.id); }));
        const results = rankResults(searchQuery, props.city.id, merged);
        if (results.length === 0) track('search_no_results', { q: final, city: props.city.id, source: 'supabase' });
        if (results.expansion) track('search_concept_expansion', { q: final, expansion: results.expansion.expansion, matched: results.expansion.matched });
        setRecents(pushRecent(final));
        setLoading(false);
        props.onSearch(final, results, results.expansion, aiHint);
        return;
      }
    } catch(e) {}

    const results = rankResults(searchQuery, props.city.id, SEARCHABLE);
    if (results.length === 0) track('search_no_results', { q: final, city: props.city.id });
    if (results.expansion) track('search_concept_expansion', { q: final, expansion: results.expansion.expansion, matched: results.expansion.matched });
    setRecents(pushRecent(final));
    setLoading(false);
    props.onSearch(final, results, results.expansion, aiHint);
  }

  function onSuggestClick(text){
    setQ(text);
    track('suggestion_click', { q: text, city: props.city.id });
    submit(text);
  }
  function onRecentClick(text){
    setQ(text);
    track('recent_click', { q: text, city: props.city.id });
    submit(text);
  }
  function onRecentRemove(e, text){
    e.stopPropagation();
    track('recent_remove', { q: text });
    setRecents(removeRecent(text));
  }
  function onRecentClear(e){
    e.stopPropagation();
    track('recent_clear', {});
    setRecents(clearRecent());
  }
  function onResultClick(item){
    track('result_click_inline', { id: item.id, q: q, city: props.city.id });
    props.onItemClick(item);
    setFocused(false);
  }
  function onKey(e){
    const items = live.length ? live : (recents.length ? recents.concat(suggestions) : suggestions);
    if (e.key === 'ArrowDown'){ e.preventDefault(); setHi(Math.min(hi + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); setHi(Math.max(hi - 1, -1)); }
    else if (e.key === 'Enter'){
      e.preventDefault();
      // If the user arrowed onto a specific row, act on that row.
      if (hi >= 0 && live.length && live[hi]){ onResultClick(live[hi]); return; }
      if (hi >= 0 && !live.length && items[hi]){
        const item = items[hi];
        if (typeof item === 'string') onRecentClick(item);
        else onSuggestClick(item.q);
        return;
      }
      // Common case: run the full search and show the results page.
      if (q.trim()){ submit(); }
    }
    else if (e.key === 'Escape'){ setFocused(false); }
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className={'search-bar' + (focused ? ' focused' : '') + (loading ? ' focused' : '')} onClick={function(){ if (!loading) setFocused(true); }}>
        <span className="search-go" role="button" tabIndex={0} title="Search"
          onClick={function(e){ e.stopPropagation(); if (q.trim() && !loading) submit(); }}
          onKeyDown={function(e){ if (e.key === 'Enter' && q.trim() && !loading) submit(); }}>
          {loading ? (
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--gold)" strokeWidth="2" fill="none" style={{ animation:'spin 0.8s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(201,169,110,0.25)" strokeWidth="2.5"/>
              <path d="M12 2 a10 10 0 010 20" strokeLinecap="round"/>
            </svg>
          ) : (
            <Icon.Search/>
          )}
        </span>
        <input className="search-input"
          placeholder={'Search your trip: meals, essentials, outfits, experiences\u2026'}
          value={q}
          disabled={loading}
          onChange={function(e){ setQ(e.target.value); setHi(-1); }}
          onFocus={function(){ setFocused(true); }}
          onKeyDown={onKey}
          style={loading ? { opacity: 0.6 } : {}}
        />
        {loading ? (
          <span className="search-kbd" style={{ color:'var(--gold)', borderColor:'rgba(201,169,110,0.3)', opacity:1 }}>AI ✦</span>
        ) : q ? (
          <span className="search-clear" onClick={function(e){ e.stopPropagation(); setQ(''); if (props.onClearResults) props.onClearResults(); }}><Icon.X/></span>
        ) : (
          <span className="search-kbd">ENTER</span>
        )}
      </div>

      {showDrop ? (
        <div className="search-dropdown">
          {q.trim() === '' ? (
            <React.Fragment>
              {recents.length > 0 ? (
                <div className="search-section">
                  <div className="search-section-header">
                    <div className="search-section-label"><Icon.Clock/> Recent</div>
                    <button className="search-section-action" onClick={onRecentClear}>Clear all</button>
                  </div>
                  {recents.map(function(r, idx){
                    const cls = 'search-suggest' + (idx === hi ? ' hi' : '');
                    return (
                      <button key={r} className={cls} onMouseEnter={function(){ setHi(idx); }}
                        onClick={function(){ onRecentClick(r); }}>
                        <span className="search-suggest-icon"><Icon.Clock/></span>
                        <span className="search-suggest-text">
                          <div className="search-suggest-title">{r}</div>
                        </span>
                        <button className="search-suggest-remove"
                          onClick={function(e){ onRecentRemove(e, r); }}
                          title="Remove from recent">
                          <Icon.X/>
                        </button>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div className="search-section">
                <div className="search-section-label"><Icon.Sparkles/> Suggested searches</div>
                {suggestions.map(function(s, idx){
                  const I = Icon[s.icon] || Icon.Search;
                  const offset = recents.length;
                  const cls = 'search-suggest' + ((idx + offset) === hi ? ' hi' : '');
                  return (
                    <button key={s.q} className={cls} onMouseEnter={function(){ setHi(idx + offset); }}
                      onClick={function(){ onSuggestClick(s.q); }}>
                      <span className="search-suggest-icon"><I/></span>
                      <span className="search-suggest-text">
                        <div className="search-suggest-title">{s.q}</div>
                      </span>
                      <span className="search-suggest-arrow"><Icon.ArrowRight/></span>
                    </button>
                  );
                })}
              </div>
            </React.Fragment>
          ) : (
            <div>
              {live.length === 0 ? (
                <div className="search-empty">
                  No matches for <strong>"{q}"</strong>. Try a broader term.
                </div>
              ) : (
                <div className="search-section">
                  <div className="search-section-label"><Icon.Fire/> Top matches</div>
                  {live.map(function(it, idx){
                    const isSocial = it.category === 'social';
                    const platformIcon = isSocial && PLATFORM_ICONS[it.platform] ? Icon[PLATFORM_ICONS[it.platform]] : null;
                    const I = Icon[CATEGORIES[it.category] && CATEGORIES[it.category].icon] || Icon.Search;
                    const cls = 'search-suggest' + (idx === hi ? ' hi' : '');
                    return (
                      <button key={it.id} className={cls} onMouseEnter={function(){ setHi(idx); }}
                        onClick={function(){ onResultClick(it); }}>
                        <span className="search-suggest-icon has-img" style={{ backgroundImage:'url(' + it.image_url + ')' }}></span>
                        <span className="search-suggest-text">
                          <div className="search-suggest-title">{highlight(it.title, q)}</div>
                          <div className="search-suggest-meta">
                            {isSocial
                              ? (PLATFORM_LABELS[it.platform] || it.platform) + ' · ' + (it.creator_handle || '')
                              : CATEGORIES[it.category].label + ' · ' + (it.city === 'all' ? 'All cities' : ((CITIES.find(function(c){ return c.id === it.city; }) || {}).name || it.city))}
                          </div>
                        </span>
                        <span className="search-suggest-arrow"><Icon.ArrowRight/></span>
                      </button>
                    );
                  })}
                  <button className="search-suggest" style={{ justifyContent:'center', color:'var(--gold)', fontSize:'0.72rem', letterSpacing:'2px', textTransform:'uppercase', fontWeight:600 }}
                    onClick={function(){ submit(); }}>
                    See all results for "{q}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchResults(props) {
  const grouped = {};
  CATEGORY_ORDER.forEach(function(c){ grouped[c] = []; });
  props.results.forEach(function(r){
    if (grouped[r.category]) grouped[r.category].push(r);
  });

  return (
    <section>
      <div className="results-head">
        <div>
          <h2 className="results-title">Results for <em>"{props.query}"</em></h2>
          <div className="results-count" style={{ marginTop:'0.35rem' }}>{props.results.length} matches across BagFree</div>
          {props.expansion ? (
            <div className="smart-match">
              <Icon.Sparkles/>
              <span className="smart-match-label">Smart match</span>
              <span className="smart-match-terms">also searching: {props.expansion.expansion}</span>
            </div>
          ) : null}
          {props.aiHint ? (
            <div className="smart-match" style={{ marginTop:'0.45rem', background:'linear-gradient(135deg,rgba(100,140,255,0.10),rgba(100,140,255,0.04))', borderColor:'rgba(100,140,255,0.25)' }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#7aa2f7" strokeWidth="1.5"><path d="M12 3 L13.5 9 L19.5 10.5 L13.5 12 L12 18 L10.5 12 L4.5 10.5 L10.5 9 Z"/></svg>
              <span className="smart-match-label" style={{ color:'rgb(122,162,247)' }}>AI</span>
              <span className="smart-match-terms">{props.aiHint}</span>
            </div>
          ) : null}
        </div>
        <button className="results-clear" onClick={props.onClear}>
          <Icon.X/> Clear search
        </button>
      </div>

      {props.results.length === 0 ? (
        <div className="results-empty">
          <div className="results-empty-title">No matches in the catalog</div>
          <div className="results-empty-tag">We couldn’t find a BagFree item for “{props.query}”. Our concierge can help with travel questions, recommendations, and anything we don’t stock.</div>
          <button className="empty-concierge" onClick={function(){ if(props.onAskConcierge) props.onAskConcierge(props.query); }}>
            <Icon.Chat/> Ask the Concierge
          </button>
        </div>
      ) : (
        CATEGORY_ORDER.filter(function(c){ return grouped[c].length > 0; }).map(function(catKey){
          const cat = CATEGORIES[catKey];
          const items = grouped[catKey];
          return (
            <div key={catKey} className="results-group">
              <div className="results-group-head">
                <h3 className="results-group-title">{cat.label}</h3>
                <span className="results-group-count">{items.length} {items.length === 1 ? 'result' : 'results'}</span>
              </div>
              <div className="results-grid">
                {items.map(function(it){
                  const isSocial = it.category === 'social';
                  const platformIcon = isSocial && PLATFORM_ICONS[it.platform] ? Icon[PLATFORM_ICONS[it.platform]] : null;
                  const platformLabel = isSocial ? (PLATFORM_LABELS[it.platform] || it.platform) : null;
                  return (
                    <div key={it.id}
                         className={'result-card' + (isSocial ? ' social' : '')}
                         style={{ cursor:'pointer' }}
                         onClick={function(){ props.onItemClick(it); }}>
                      <div className="result-img" style={{ backgroundImage:'url(' + it.image_url + ')' }}>
                        {isSocial && platformIcon ? (
                          <span className={'result-platform p-' + it.platform}>
                            {React.createElement(platformIcon)} {platformLabel}
                          </span>
                        ) : (
                          <span className="result-cat">{cat.label}</span>
                        )}
                        <span className="result-rank"><Icon.Trophy/> {it.reality_rank_score}</span>
                        {isSocial ? (
                          <div className="result-play"><span className="result-play-btn"><Icon.Play/></span></div>
                        ) : null}
                      </div>
                      <div className="result-body">
                        <div className="result-title">{it.title}</div>
                        {isSocial ? (
                          <div className="result-creator">
                            <span className="result-creator-handle">{it.creator_handle}</span>
                            <span>· {relativeTime(it.posted_at)}</span>
                            {it.view_count ? (
                              <span className="result-creator-stats"><Icon.Eye/> {formatCount(it.view_count)}</span>
                            ) : null}
                          </div>
                        ) : (
                          <div className="result-city"><Icon.Pin/> {it.city === 'all' ? 'All cities' : (CITIES.find(function(c){ return c.id === it.city; }) || {}).name || it.city}</div>
                        )}
                        <div className="result-desc">{it.description}</div>
                        <span className="result-cta">View details <Icon.ArrowRight/></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

function relatedItems(item, all){
  const myTags = item.tags || [];
  return all
    .filter(function(x){ return x.id !== item.id; })
    .map(function(x){
      let score = 0;
      const itsTags = x.tags || [];
      myTags.forEach(function(t){ if (itsTags.indexOf(t) >= 0) score += 3; });
      if (x.city === item.city) score += 2;
      else if (x.city === 'all') score += 1;
      if (item.category === 'social' && x.category !== 'social') score += 0.5;
      return Object.assign({}, x, { _related: score });
    })
    .filter(function(x){ return x._related > 0; })
    .sort(function(a,b){ return b._related - a._related; })
    .slice(0, 6);
}

function ResultDetail(props){
  const item = props.item;
  const isSocial = item.category === 'social';
  const platformIcon = isSocial && PLATFORM_ICONS[item.platform] ? Icon[PLATFORM_ICONS[item.platform]] : null;
  const platformLabel = isSocial ? (PLATFORM_LABELS[item.platform] || item.platform) : null;
  const related = relatedItems(item, SEARCHABLE);
  const ctaLabel = isSocial ? ('Watch on ' + platformLabel) : (CTA_LABELS[item.category] || 'View on BagFree');
  const categoryLabel = CATEGORIES[item.category] ? CATEGORIES[item.category].label : item.category;
  const cityLabel = item.city === 'all' ? 'All cities' : ((CITIES.find(function(c){ return c.id === item.city; }) || {}).name || item.city);
  const partnerName = item.partner_id && item.partner_id !== 'p_social_organic'
    ? item.partner_id.replace(/^p_/, '').replace(/_/g, ' ').replace(/\b\w/g, function(s){ return s.toUpperCase(); })
    : null;

  function onHeroClick(e){
    if (!isSocial) return;       // only social hero opens external on click
    e.preventDefault();
    track('result_external_click', { id: item.id, platform: item.platform });
    window.open(item.destination_url, '_blank', 'noopener,noreferrer');
  }
  function onCtaClick(){
    track('cta_click', { id: item.id, category: item.category, label: ctaLabel });
  }

  return (
    <section className="detail-wrap">
      <button className="detail-back" onClick={props.onBack}>
        <Icon.ArrowLeft/> Back to results
      </button>

      <div className="detail-hero"
           style={Object.assign({ backgroundImage:'url(' + item.image_url + ')' }, isSocial ? {} : { cursor:'default' })}
           onClick={onHeroClick}>
        {isSocial && platformIcon ? (
          <div className="detail-hero-platform">
            <span className={'result-platform p-' + item.platform}>
              {React.createElement(platformIcon)} {platformLabel}
            </span>
          </div>
        ) : null}
        {isSocial ? (
          <div className="detail-hero-overlay">
            <div className="detail-play"><Icon.Play/></div>
          </div>
        ) : null}
      </div>

      <div className="detail-info">
        <div className="detail-main">
          {isSocial && platformIcon ? (
            <div className="detail-platform-row">{React.createElement(platformIcon)} {platformLabel}</div>
          ) : (
            <div className="detail-platform-row">{categoryLabel}</div>
          )}

          <h1 className="detail-title">{item.title}</h1>

          {isSocial ? (
            <div className="detail-creator-row">
              <span className="handle">{item.creator_handle}</span>
              <span className="sep">·</span>
              <span>{relativeTime(item.posted_at)}</span>
              {item.view_count ? (
                <React.Fragment>
                  <span className="sep">·</span>
                  <span className="stat-inline"><Icon.Eye/> {formatCount(item.view_count)} views</span>
                </React.Fragment>
              ) : null}
            </div>
          ) : (
            <div className="detail-creator-row">
              <span className="stat-inline"><Icon.Pin/> {cityLabel}</span>
              {partnerName ? (
                <React.Fragment>
                  <span className="sep">·</span>
                  <span className="detail-partner-row"><Icon.Check/> Verified Partner</span>
                </React.Fragment>
              ) : null}
            </div>
          )}

          <p className="detail-description">{item.description}</p>

          {item.tags && item.tags.length > 0 ? (
            <div className="detail-tags">
              {item.tags.slice(0, 8).map(function(t){
                return <span key={t} className="detail-tag">#{t}</span>;
              })}
            </div>
          ) : null}

          <div className="detail-actions">
            <a className="detail-cta-primary"
               href={item.destination_url}
               target={isSocial ? '_blank' : undefined}
               rel={isSocial ? 'noopener noreferrer' : undefined}
               onClick={onCtaClick}>
              {ctaLabel} <Icon.ArrowRight/>
            </a>
          </div>
        </div>

        <div className="detail-aside">
          {isSocial ? (
            <React.Fragment>
              <div className="detail-aside-label">Engagement</div>
              <div className="detail-stat">
                <span className="detail-stat-label">Views</span>
                <span className="detail-stat-value">{formatCount(item.view_count) || '—'}</span>
              </div>
              <div className="detail-aside-divider"></div>
              <div className="detail-stat">
                <span className="detail-stat-label">Likes</span>
                <span className="detail-stat-value">{formatCount(item.like_count) || '—'}</span>
              </div>
              <div className="detail-aside-divider"></div>
              <div className="detail-stat">
                <span className="detail-stat-label">RealityRank</span>
                <span className="detail-stat-value">{item.reality_rank_score || computeRealityRank(item)}</span>
              </div>
              <div className="detail-aside-divider"></div>
              <div className="detail-stat">
                <span className="detail-stat-label">Posted</span>
                <span className="detail-stat-value" style={{ fontSize:'0.95rem' }}>{relativeTime(item.posted_at)}</span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="detail-aside-label">Key Info</div>
              <div className="detail-stat">
                <span className="detail-stat-label">Category</span>
                <span className="detail-stat-value" style={{ fontSize:'0.95rem' }}>{categoryLabel}</span>
              </div>
              <div className="detail-aside-divider"></div>
              <div className="detail-stat">
                <span className="detail-stat-label">City</span>
                <span className="detail-stat-value" style={{ fontSize:'0.95rem' }}>{cityLabel}</span>
              </div>
              <div className="detail-aside-divider"></div>
              <div className="detail-stat">
                <span className="detail-stat-label">RealityRank</span>
                <span className="detail-stat-value">{item.reality_rank_score || computeRealityRank(item)}</span>
              </div>
              {partnerName ? (
                <React.Fragment>
                  <div className="detail-aside-divider"></div>
                  <div className="detail-stat">
                    <span className="detail-stat-label">Partner</span>
                    <span className="detail-stat-value" style={{ fontSize:'0.95rem' }}>{partnerName}</span>
                  </div>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          )}
        </div>
      </div>

      {related.length > 0 ? (
        <React.Fragment>
          <div className="detail-related-head">
            <h3 className="detail-related-title">Related on BagFree</h3>
            <span className="detail-related-tag">Based on this item's topics and city</span>
          </div>
          <div className="results-grid">
            {related.map(function(it){
              const isSoc = it.category === 'social';
              const pIcon = isSoc && PLATFORM_ICONS[it.platform] ? Icon[PLATFORM_ICONS[it.platform]] : null;
              const pLabel = isSoc ? (PLATFORM_LABELS[it.platform] || it.platform) : null;
              return (
                <div key={it.id} className={'result-card' + (isSoc ? ' social' : '')}
                     style={{ cursor:'pointer' }}
                     onClick={function(){ props.onItemClick(it); }}>
                  <div className="result-img" style={{ backgroundImage:'url(' + it.image_url + ')' }}>
                    {isSoc && pIcon ? (
                      <span className={'result-platform p-' + it.platform}>
                        {React.createElement(pIcon)} {pLabel}
                      </span>
                    ) : (
                      <span className="result-cat">{CATEGORIES[it.category].label}</span>
                    )}
                  </div>
                  <div className="result-body">
                    <div className="result-title">{it.title}</div>
                    {isSoc ? (
                      <div className="result-creator">
                        <span className="result-creator-handle">{it.creator_handle}</span>
                        {it.view_count ? (<span className="result-creator-stats"><Icon.Eye/> {formatCount(it.view_count)}</span>) : null}
                      </div>
                    ) : (
                      <div className="result-city"><Icon.Pin/> {it.city === 'all' ? 'All cities' : ((CITIES.find(function(c){ return c.id === it.city; }) || {}).name || it.city)}</div>
                    )}
                    <div className="result-desc">{it.description}</div>
                    <span className="result-cta">View details <Icon.ArrowRight/></span>
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ) : null}
    </section>
  );
}

function TopBar(props) {
  const menuState = useState(false);
  const open = menuState[0];
  const setOpen = menuState[1];

  React.useEffect(function(){
    if (!open) return;
    function onDoc(){ setOpen(false); }
    document.addEventListener('click', onDoc);
    return function(){ document.removeEventListener('click', onDoc); };
  }, [open]);

  const cls = 'meta-item clickable' + (open ? ' open' : '');

  return (
    <div className="topbar">
      <div className="greeting">
        <h1 className="greeting-title">
          <div style={{marginBottom:'0.6rem'}}>Travel Light.</div>
          <div style={{marginBottom:'0.6rem'}}>Experience More.</div>
          <em style={{color:'var(--gold)',fontStyle:'italic'}}>Leave Less Behind.</em>
        </h1>
        <div style={{fontSize:'0.92rem',color:'var(--muted)',fontWeight:300,marginTop:'1.5rem',marginBottom:'1.8rem',lineHeight:1.6,maxWidth:'520px'}}>Travel lighter, discover more, and help create a more<br/>sustainable way to explore the world.</div>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1rem',opacity:0.5}}>
          <div style={{width:'60px',height:'1px',background:'var(--gold)'}}></div>
          <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--gold)'}}></div>
          <div style={{width:'6px',height:'6px',border:'1px solid var(--gold)',transform:'rotate(45deg)'}}></div>
          <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--gold)'}}></div>
          <div style={{width:'60px',height:'1px',background:'var(--gold)'}}></div>
        </div>
        <div className="greeting-sub" style={{fontSize:'1.15rem',fontFamily:'var(--ff-display)',fontWeight:400,marginBottom:'0.2rem'}}>Welcome to {props.city.name}!</div>
        <div className="greeting-tag">Everything you need. Delivered before you arrive.</div>
        <div className="meta-row">
          <div className="meta-anchor">
            <div className={cls} onClick={function(e){ e.stopPropagation(); setOpen(!open); }}>
              <Icon.Pin/> {props.city.name}, {props.city.region}
              <span className="chev"><Icon.Chevron/></span>
            </div>
            {open ? <CityMenu city={props.city} setCity={props.setCity} close={function(){ setOpen(false); }}/> : null}
          </div>
          {props.city.temp ? <div className="meta-item"><Icon.Sun/> {props.city.temp}</div> : null}
        </div>
        <a href="/departure-lounge-landing.html" className="lost-luggage">
          <span className="ll-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5S18 3 16.5 4.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          </span>
          <span className="ll-text">
            <span className="ll-title">Lost Luggage?</span>
            <span className="ll-desc">Get clothing, essentials, and toiletries delivered to your hotel. Same-day service available in select cities.</span>
          </span>
          <span className="ll-cta">Learn More →</span>
        </a>
        <SearchBar city={props.city} onSearch={props.onSearch} onItemClick={props.onItemClick} onClearResults={props.onClearResults}/>
      </div>
      <div className="topbar-right">
      <div className="topbar-actions">
        <a href="/account-login.html" className="sign-in-btn" id="signInBtn">Sign In</a>
        <a href="/join-network.html" className="join-network-btn">Join Network</a>
        <ThemeToggle/>
        <button className="icon-btn" title="Search"><Icon.Search/></button>
        <button className="icon-btn" title="Notifications" id="notifBtn">
          <Icon.Bell/><span className="badge" id="notifBadge" style={{display:'none'}}>0</span>
        </button>
        <div className="profile-chip" id="profileChip" onClick={toggleProfileDropdown}>
          <div className="profile-avatar" id="profileAvatar" title="Upload profile photo">
            <div className="profile-initial" id="profileInitial">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
          </div>
          <Icon.Chevron/>
          <input type="file" id="avatarFileInput" accept="image/*" style={{display:'none'}} onChange={handleAvatarUpload}/>
          <div className="profile-dropdown" id="profileDropdown">
            <div className="profile-dd-header">
              <div className="profile-dd-name" id="ddName">Guest</div>
              <div className="profile-dd-email" id="ddEmail"></div>
            </div>
            <div className="profile-dd-bag">
              <span className="profile-dd-bag-label">BAG Balance</span>
              <span className="profile-dd-bag-val" id="ddBag">$0</span>
            </div>
            <button className="profile-dd-item" onClick={triggerAvatarUpload} style={{color:'var(--gold)'}}>
              <span style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Profile Photo
              </span>
            </button>
            <a href="/account.html" className="profile-dd-item">My Account</a>
            <a href="/account.html#orders" className="profile-dd-item">Order History</a>
            <a href="/donate.html" className="profile-dd-item">Donate &amp; Earn</a>
            <a href="/membership.html" className="profile-dd-item">Membership</a>
            <button className="profile-dd-item" id="ddSignOut" onClick={handleSignOut} style={{color:'rgba(224,114,96,0.7)'}}>Sign Out</button>
          </div>
        </div>
      </div>
      {props.networkCard || null}
      <MapStrip/>
      </div>
    </div>
  );
}

function Tile(props) {
  const t = props.tile;
  const I = t.icon;
  const isTeal = t.tealAccent;
  return (
    <a className={'tile' + (isTeal ? ' tile-teal' : '')} href={t.link || '#'}>
      {t.badge ? <div className={'tile-badge' + (isTeal ? ' tile-badge-teal' : '')}>{t.badge}</div> : null}
      {isTeal ? <div className="tile-teal-line"></div> : null}
      <div className="tile-image" style={{ backgroundImage: 'url(' + t.img + ')' }}></div>
      <div className="tile-top">
        <div className={'tile-icon' + (isTeal ? ' tile-icon-teal' : '')}><I/></div>
        <div className="tile-title">{t.title}</div>
        <div className="tile-desc">{t.desc}</div>
        {t.verified ? (
          <div className="tile-verified">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div className="tile-verified-text">
              <div className="tile-verified-label">Second Journey™ Verified</div>
              <div className="tile-verified-sub">{t.verified}</div>
            </div>
          </div>
        ) : null}
      </div>
    </a>
  );
}

function Grid(props) {
  var start = props.start || 0;
  var end = props.end !== undefined ? props.end : TILES.length;
  return (
    <div className="grid">
      {TILES.slice(start, end).map(function(t){ return <Tile key={t.id} tile={t}/>; })}
    </div>
  );
}

function GrowingNetwork(props) {
  var onCitySelect = props.onCitySelect || function(){};
  function selectCity(id) {
    var c = CITIES.find(function(c){ return c.id === id; });
    if (c && !c.soon) onCitySelect(c);
  }
  /* Southeast US map — simplified state outlines (GA, FL, SC, AL) in a 460x300 viewBox */
  return (
    <section className="gn-card">
      <div className="gn-left">
        <div className="gn-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
          BagFree Network
        </div>
        <h2 className="gn-title">Growing Network</h2>
        <div className="gn-sub">Travel lighter in these destinations today.</div>

        <div className="gn-list-label">Currently Available</div>
        <div className="gn-list">
          <div className="gn-list-item gn-list-item--click" onClick={function(){ selectCity('savannah'); }}><span className="gn-dot gn-dot--live"></span>Savannah, GA</div>
          <div className="gn-list-item gn-list-item--click" onClick={function(){ selectCity('tampa'); }}><span className="gn-dot gn-dot--live"></span>Tampa, FL</div>
        </div>

        <div className="gn-list-label">Expanding Soon</div>
        <div className="gn-list">
          <div className="gn-list-item"><span className="gn-dot gn-dot--soon"></span>Orlando, FL</div>
          <div className="gn-list-item"><span className="gn-dot gn-dot--soon"></span>Atlanta, GA</div>
          <div className="gn-list-item"><span className="gn-dot gn-dot--soon"></span>Miami, FL</div>
        </div>
      </div>

      <div className="gn-map-wrap">
        <svg className="gn-map" viewBox="37 8 435 284" preserveAspectRatio="xMidYMid meet" aria-label="BagFree network coverage map of the southeastern United States">
          {/* Real state boundaries (US Census via GeoJSON, equirectangular projection) */}
          <path d="M142.7 23.2 L182.4 23.6 L186.4 46.1 L192.0 79.3 L194.6 86.6 L197.1 90.7 L196.1 93.3 L198.7 94.9 L194.8 98.2 L195.0 101.5 L193.0 106.0 L195.2 113.8 L193.6 120.7 L196.1 127.9 L184.9 128.0 L137.3 128.0 L136.5 131.5 L141.6 136.5 L140.7 140.8 L142.5 143.0 L139.1 146.8 L136.0 147.7 L130.3 143.4 L129.7 136.9 L128.0 136.2 L125.9 141.1 L125.1 145.8 L119.3 144.5 L117.5 104.5 L122.8 54.7 L126.0 26.0 L123.6 23.3 L142.7 23.2 Z" className="gn-state"/>
          <path d="M239.0 23.2 L234.2 28.8 L233.8 31.5 L241.4 37.1 L243.7 36.7 L247.2 42.4 L247.9 45.4 L251.5 50.9 L256.7 54.2 L259.7 59.0 L265.8 63.5 L265.5 66.5 L269.5 71.4 L275.6 75.4 L277.1 79.7 L277.3 85.3 L280.4 87.2 L284.0 94.2 L284.2 98.6 L289.4 100.9 L283.8 109.8 L282.8 114.4 L280.4 118.4 L280.2 122.6 L277.7 124.5 L276.7 135.7 L270.5 134.6 L265.3 132.5 L263.2 134.5 L264.1 139.4 L263.1 144.7 L260.3 144.8 L259.2 139.2 L230.2 137.2 L199.2 135.5 L196.1 127.9 L193.6 120.7 L195.2 113.8 L193.0 106.0 L195.0 101.5 L194.8 98.2 L198.7 94.9 L196.1 93.3 L197.1 90.7 L194.6 86.6 L192.0 79.3 L186.4 46.1 L182.4 23.6 L211.6 23.5 L227.5 23.6 L239.0 23.2 Z" className="gn-state"/>
          <path d="M246.8 21.4 L251.6 19.0 L257.9 18.0 L285.8 19.3 L285.9 22.0 L288.2 20.4 L291.7 24.9 L291.3 27.9 L316.8 28.3 L342.5 53.3 L338.5 54.6 L333.5 58.9 L328.7 65.6 L327.8 71.1 L324.0 75.4 L318.9 75.4 L317.8 78.5 L312.4 82.0 L309.5 85.7 L304.7 87.3 L299.7 91.3 L299.2 93.2 L294.4 95.3 L289.4 100.9 L284.2 98.6 L284.0 94.2 L280.4 87.2 L277.3 85.3 L277.1 79.7 L275.6 75.4 L269.5 71.4 L265.5 66.5 L265.8 63.5 L259.7 59.0 L256.7 54.2 L251.5 50.9 L247.9 45.4 L247.2 42.4 L243.7 36.7 L241.4 37.1 L233.8 31.5 L234.2 28.8 L239.0 23.2 L246.8 21.4 Z" className="gn-state"/>
          <path d="M184.9 128.0 L196.1 127.9 L199.2 135.5 L230.2 137.2 L259.2 139.2 L260.3 144.8 L263.1 144.7 L264.1 139.4 L263.2 134.5 L265.3 132.5 L270.5 134.6 L276.7 135.7 L278.1 147.0 L280.9 159.8 L287.5 176.5 L297.5 194.5 L296.1 195.8 L296.6 204.1 L300.8 213.4 L307.3 232.2 L308.7 238.1 L308.6 244.1 L306.1 265.8 L304.0 266.2 L301.8 273.0 L302.5 275.1 L298.2 280.0 L296.4 278.8 L292.2 280.9 L285.0 282.0 L282.9 279.3 L283.9 275.3 L278.8 263.6 L274.8 261.5 L271.4 263.1 L268.6 256.6 L267.9 251.3 L263.2 245.4 L262.1 241.5 L262.8 235.9 L260.2 234.9 L260.8 238.2 L258.5 239.1 L251.3 224.9 L248.4 221.3 L255.2 210.8 L250.8 211.4 L247.8 214.7 L244.8 209.5 L248.8 195.2 L249.5 183.3 L246.8 180.4 L245.9 176.5 L241.6 175.7 L236.5 169.4 L232.4 166.8 L232.2 162.9 L229.3 161.5 L227.0 157.2 L218.3 151.4 L210.7 152.7 L211.1 156.7 L208.6 156.0 L199.2 160.9 L189.1 162.1 L189.4 159.2 L187.0 155.7 L175.2 148.0 L166.8 144.7 L159.2 143.8 L152.9 144.4 L139.1 146.8 L142.5 143.0 L140.7 140.8 L141.6 136.5 L136.5 131.5 L137.3 128.0 L184.9 128.0 Z" className="gn-state"/>
          <text x="155.4" y="83.4" className="gn-state-label" textAnchor="middle">AL</text>
          <text x="232.4" y="86.1" className="gn-state-label" textAnchor="middle">GA</text>
          <text x="273.2" y="214.4" className="gn-state-label" textAnchor="middle">FL</text>

          {/* Charleston, SC — expanding */}
          <line x1="311.0" y1="81.4" x2="345.0" y2="75.4" className="gn-leader gn-leader--soon"/>
          <circle cx="311.0" cy="81.4" r="5.5" className="gn-marker gn-marker--soon"/>
          <text x="351.0" y="79.4" className="gn-map-label gn-map-label--soon">SC</text>

          {/* Savannah — live */}
          {/* Savannah — live, clickable */}
          <line x1="284.7" y1="99.7" x2="336.7" y2="99.7" className="gn-leader gn-leader--live"/>
          <circle cx="284.7" cy="99.7" r="6.5" className="gn-marker gn-marker--live"/>
          <circle cx="284.7" cy="99.7" r="11" className="gn-marker-ring"/>
          <circle cx="284.7" cy="99.7" r="18" fill="transparent" style={{cursor:'pointer'}} onClick={function(){ selectCity('savannah'); }}/>
          <text x="342.7" y="103.7" className="gn-map-label" style={{cursor:'pointer'}} onClick={function(){ selectCity('savannah'); }}>Savannah</text>

          {/* Orlando — expanding */}
          <line x1="278.2" y1="192.5" x2="324.2" y2="192.5" className="gn-leader gn-leader--soon"/>
          <circle cx="278.2" cy="192.5" r="5.5" className="gn-marker gn-marker--soon"/>
          <text x="330.2" y="196.5" className="gn-map-label gn-map-label--soon">Orlando</text>

          {/* Atlanta — expanding */}
          <line x1="210" y1="56" x2="166" y2="48" className="gn-leader gn-leader--soon"/>
          <circle cx="210" cy="56" r="5.5" className="gn-marker gn-marker--soon"/>
          <text x="160" y="52" className="gn-map-label gn-map-label--soon" textAnchor="end">Atlanta</text>

          {/* Miami — expanding */}
          <line x1="305.1" y1="265.2" x2="351.1" y2="265.2" className="gn-leader gn-leader--soon"/>
          <circle cx="305.1" cy="265.2" r="5.5" className="gn-marker gn-marker--soon"/>
          <text x="357.1" y="269.2" className="gn-map-label gn-map-label--soon">Miami</text>

          {/* Tampa — live */}
          {/* Tampa — live, clickable */}
          <line x1="253.8" y1="207.9" x2="209.8" y2="207.9" className="gn-leader gn-leader--live"/>
          <circle cx="253.8" cy="207.9" r="6.5" className="gn-marker gn-marker--live"/>
          <circle cx="253.8" cy="207.9" r="11" className="gn-marker-ring gn-marker-ring--alt"/>
          <circle cx="253.8" cy="207.9" r="18" fill="transparent" style={{cursor:'pointer'}} onClick={function(){ selectCity('tampa'); }}/>
          <text x="209.8" y="211.9" className="gn-map-label" textAnchor="end" style={{cursor:'pointer'}} onClick={function(){ selectCity('tampa'); }}>Tampa</text>
          <text x="203.8" y="211.9" className="gn-map-label" textAnchor="end">Tampa</text>
        </svg>
      </div>

      <div className="gn-stats">
        <div className="gn-stat">
          <div className="gn-stat-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            <span className="gn-stat-val">4</span>
          </div>
          <div className="gn-stat-lbl">Cities Active</div>
        </div>
        <div className="gn-stat">
          <div className="gn-stat-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20"/><path d="M4 20V8a2 2 0 012-2h12a2 2 0 012 2v12"/><path d="M9 20v-4h6v4"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01"/></svg>
            <span className="gn-stat-val">18</span>
          </div>
          <div className="gn-stat-lbl">Hotels</div>
        </div>
        <div className="gn-stat">
          <div className="gn-stat-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="gn-stat-val">27</span>
          </div>
          <div className="gn-stat-lbl">Curators</div>
        </div>
        <div className="gn-stat">
          <div className="gn-stat-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.4 14.5L16 10 4 20"/><circle cx="7.5" cy="7.5" r="3.5"/><path d="M14 4l6 6"/></svg>
            <span className="gn-stat-val">12</span>
          </div>
          <div className="gn-stat-lbl">Style Partners</div>
        </div>
        <a href="/join-network.html" className="gn-coverage-link">View Coverage
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </section>
  );
}

function MeetLocalExperts() {
  var cards = [
    {
      type: 'curator', isExample: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
      name: 'Jasmine L.',
      role: 'Savannah Insider',
      city: 'Savannah, GA',
      rating: '4.9',
      reviews: 128,
      tags: ['Food', 'Culture', 'History'],
      cta: 'View Profile',
      href: '/curators.html',
      bio: 'Born and raised in Savannah. I know every hidden square, every legendary kitchen, and every story the guidebooks miss.'
    },
    {
      type: 'itinerary', isExample: true,
      img: '/savannah-walking-tour.png',
      label: 'FEATURED ITINERARY',
      title: 'Historic Squares Walking Tour',
      curator: 'Jasmine L.',
      price: '$45',
      duration: '2.5 hrs',
      group: 'Up to 8',
      cta: 'Book Experience',
      href: '/experiences.html'
    },
    {
      type: 'style', isExample: true,
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=faces',
      name: 'Lynda Osorio',
      role: 'Power Image',
      city: 'Miami, FL',
      rating: '5.0',
      reviews: 64,
      tags: ['Luxury', 'Fashion', 'Event Styling'],
      cta: 'View Style Partner',
      href: '/local-style-partners.html',
      bio: 'Miami\u2019s premier image consultant. Executive presence, event dressing, and destination style \u2014 curated for you.'
    },
    {
      type: 'itinerary', isExample: true,
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop',
      label: 'TOP EXPERIENCE',
      title: 'Midnight Garden Food Crawl',
      curator: 'Jasmine L.',
      price: '$65',
      duration: '3 hrs',
      group: 'Up to 6',
      cta: 'Book Experience',
      href: '/experiences.html'
    }
  ];

  return (
    <div className="mle-wrap">
      <div className="mle-header">
        <div className="mle-eyebrow">&#x2756; Exclusive to BagFree</div>
        <h2 className="mle-title">More than a booking platform.</h2>
        <p className="mle-sub">Connect with real local experts, book handpicked experiences, and work with destination style partners — all in one place.</p>
        <div className="mle-chips">
          <div className="mle-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Curator Profiles
          </div>
          <div className="mle-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4 4-4z"/></svg>
            Local Experiences
          </div>
          <div className="mle-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.4 14.5L16 10 4 20"/><circle cx="7.5" cy="7.5" r="3.5"/></svg>
            Style Partners
          </div>
          <div className="mle-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"/></svg>
            Real Itineraries
          </div>
        </div>
      </div>
      <div className="mle-grid">
        {cards.map(function(c, i) {
          if (c.type === 'curator' || c.type === 'style') {
            return (
              <a key={i} href={c.href} className={'mle-card mle-profile' + (c.type === 'style' ? ' mle-style' : '')}>
                {c.isExample ? <div className="mle-example-ribbon">Example</div> : null}
                <div className="mle-avatar-wrap">
                  <img src={c.avatar} alt={c.name} className="mle-avatar"/>
                  <div className={'mle-type-badge' + (c.type === 'style' ? ' mle-type-style' : '')}>{c.type === 'style' ? 'Style Partner' : 'Curator'}</div>
                </div>
                <div className="mle-profile-body">
                  <div className="mle-profile-name">{c.name}</div>
                  <div className="mle-profile-role">{c.role} &middot; {c.city}</div>
                  <div className="mle-rating">
                    <span className="mle-star">&#9733;</span>
                    <span className="mle-rating-val">{c.rating}</span>
                    <span className="mle-rating-ct">({c.reviews})</span>
                  </div>
                  <p className="mle-bio">{c.bio}</p>
                  <div className="mle-tags">
                    {c.tags.map(function(tag, ti) { return <span key={ti} className="mle-tag">{tag}</span>; })}
                  </div>
                  <div className="mle-cta">{c.cta} &#x2192;</div>
                </div>
              </a>
            );
          }
          return (
            <a key={i} href={c.href} className="mle-card mle-exp">
              {c.isExample ? <div className="mle-example-ribbon">Example</div> : null}
              <div className="mle-exp-img" style={{backgroundImage:'url(' + c.img + ')'}}>
                <div className="mle-exp-img-overlay"></div>
                <div className="mle-exp-label">{c.label}</div>
              </div>
              <div className="mle-exp-body">
                <div className="mle-exp-title">{c.title}</div>
                <div className="mle-exp-curator">by {c.curator}</div>
                <div className="mle-exp-meta">
                  <span>{c.price}/person</span>
                  <span className="mle-dot-sep">&#xB7;</span>
                  <span>{c.duration}</span>
                  <span className="mle-dot-sep">&#xB7;</span>
                  <span>{c.group}</span>
                </div>
                <div className="mle-cta">{c.cta} &#x2192;</div>
              </div>
            </a>
          );
        })}
      </div>
      <div className="mle-footer">
        <a href="/curators.html" className="mle-all-link">Explore all curators &amp; experts &#x2192;</a>
        <a href="/experiences.html" className="mle-all-link">Browse all experiences &#x2192;</a>
        <a href="/local-style-partners.html" className="mle-all-link">Meet style partners &#x2192;</a>
      </div>
    </div>
  );
}

function MapStrip() {
  var svgRef = React.useRef(null);
  var [loaded, setLoaded] = React.useState(false);
  var CITIES = [
    {x:0,y:0,lng:-81.0998,lat:32.0835,d:'sameday'},{x:0,y:0,lng:-84.388,lat:33.749,d:'sameday'},
    {x:0,y:0,lng:-82.4572,lat:27.9506,d:'sameday'},{x:0,y:0,lng:-81.3792,lat:28.5383,d:'days3'},
    {x:0,y:0,lng:-80.1918,lat:25.7617,d:'days3'},{x:0,y:0,lng:-79.9311,lat:32.7765,d:'days7'},
    {x:0,y:0,lng:-86.7816,lat:36.1627,d:'days7'},{x:0,y:0,lng:-117.1611,lat:32.7157,d:'days7'},
    {x:0,y:0,lng:-118.408,lat:33.9425,d:'days7'},{x:0,y:0,lng:-122.3321,lat:47.6062,d:'days7'},
    {x:0,y:0,lng:-104.9903,lat:39.7392,d:'days7'},{x:0,y:0,lng:-112.074,lat:33.4484,d:'days7'},
    {x:0,y:0,lng:-111.891,lat:40.7608,d:'days7'},{x:0,y:0,lng:-95.3698,lat:29.7604,d:'days7'},
    {x:0,y:0,lng:-96.797,lat:32.7767,d:'days7'},{x:0,y:0,lng:-87.6298,lat:41.8781,d:'days7'},
    {x:0,y:0,lng:-82.9988,lat:39.9612,d:'days7'},{x:0,y:0,lng:-74.006,lat:40.7128,d:'days3'},
    {x:0,y:0,lng:-77.0369,lat:38.9072,d:'days3'}
  ];
  var ROUTES = [[0,2],[0,1],[2,3]];
  var DC = {sameday:'rgb(77,216,138)',days3:'rgb(232,192,106)',days7:'rgba(168,180,204,0.7)'};

  React.useEffect(function(){
    if(typeof d3==='undefined'||typeof topojson==='undefined'||!svgRef.current) return;
    var svg = d3.select(svgRef.current);
    var proj = d3.geoAlbersUsa().scale(1300).translate([487.5,305]);
    var pathFn = d3.geoPath().projection(proj);
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(function(us){
      svg.selectAll('*').remove();
      var states = topojson.feature(us, us.objects.states).features;
      svg.append('g').selectAll('path').data(states).join('path')
        .attr('d',pathFn).attr('fill','rgba(255,255,255,0.05)').attr('stroke','rgba(201,169,110,0.15)').attr('stroke-width',0.6);
      ROUTES.forEach(function(pair){
        var a=CITIES[pair[0]], b=CITIES[pair[1]];
        var pa=proj([a.lng,a.lat]), pb=proj([b.lng,b.lat]);
        if(pa&&pb) svg.append('line').attr('x1',pa[0]).attr('y1',pa[1]).attr('x2',pb[0]).attr('y2',pb[1])
          .attr('stroke','rgba(201,169,110,0.25)').attr('stroke-width',1.2).attr('stroke-dasharray','5 5');
      });
      CITIES.forEach(function(c){
        var pt=proj([c.lng,c.lat]); if(!pt) return;
        var r=c.d==='sameday'?6:c.d==='days3'?5:3;
        if(c.d==='sameday'){
          svg.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',10).attr('fill','none')
            .attr('stroke','rgba(77,216,138,0.35)').attr('stroke-width',1).style('animation','msPulse 2.8s ease-out infinite')
            .style('transform-origin',pt[0]+'px '+pt[1]+'px');
        }
        svg.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',r).attr('fill',DC[c.d]);
      });
      setLoaded(true);
    }).catch(function(){});
  },[]);

  return React.createElement('div',{className:'map-strip'},
    React.createElement('svg',{ref:svgRef,viewBox:'0 0 975 610',preserveAspectRatio:'xMidYMid meet',className:'map-strip-svg','aria-hidden':'true'})
  );
}

var HERO_IMAGES = {
  savannah: '/savannah-banner.png',
  atlanta:  '/hero-atlanta.png',
  tampa:    '/hero-tampa.png',
  orlando:  '/hero-orlando.png',
  miami:    '/hero-miami.png',
};

function Hero(props) {
  var city = props.city;
  var isLimited = city && city.limited;
  var modalState = React.useState(false);
  var showModal = modalState[0]; var setShowModal = modalState[1];
  var successState = React.useState(false);
  var submitted = successState[0]; var setSubmitted = successState[1];
  var heroImg = isLimited ? '/hero-concierge.png' : (HERO_IMAGES[city && city.id] || '/savannah-banner.png');
  var features = isLimited ? [
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M12 2a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z'}),React.createElement('path',{d:'M12 6L2 12.5a1.5 1.5 0 001.6 2.54L12 10l8.4 5.04a1.5 1.5 0 001.6-2.54L12 6z'})), label:'Clothing Rentals' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M11 20A7 7 0 014 13c0-3.5 1.7-6.6 4.3-8.5'}),React.createElement('path',{d:'M12 2a10 10 0 11-9.2 13.8'})), label:'Second Journey\u2122' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M10 3h4v2.5l1 2v12a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 19.5v-12l1-2z'}),React.createElement('path',{d:'M9 11h6'})), label:'Travel Essentials' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('circle',{cx:12,cy:12,r:9}),React.createElement('path',{d:'M12 7v5l3 3'})), label:'7-Day Advance' },
  ] : [
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('rect',{x:2,y:7,width:20,height:14,rx:2}),React.createElement('path',{d:'M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2'})), label:'Skip Baggage Fees' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3'}),React.createElement('rect',{x:9,y:11,width:14,height:10,rx:1})), label:'Travel Lighter' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'}),React.createElement('circle',{cx:9,cy:7,r:4}),React.createElement('path',{d:'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'})), label:'Local Expertise' },
    { icon:React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8},React.createElement('path',{d:'M11 20A7 7 0 014 13c0-3.5 1.7-6.6 4.3-8.5'}),React.createElement('path',{d:'M12 2a10 10 0 11-9.2 13.8'})), label:'Sustainable Impact' },
  ];
  return [
    <div className="hero-section" key="hero">
      <img key={heroImg} src={heroImg} alt={(city ? city.name : 'BagFree') + ' cityscape'} className="hero-bg-img" style={isLimited ? {objectFit:'contain',objectPosition:'center center',background:'rgb(7,16,31)'} : undefined}/>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-city-tag"><span className="hero-city-dot"></span>{isLimited ? 'Concierge Availability' : (city ? city.name : 'Savannah')}</div>
          <h1 className="hero-title">{isLimited ? React.createElement(React.Fragment,null,'Bringing BagFree',React.createElement('br'),React.createElement('em',{className:'hero-title-gold'},'To '+city.name)) : React.createElement(React.Fragment,null,'Travel Without',React.createElement('br'),React.createElement('em',{className:'hero-title-gold'},'The Baggage'))}</h1>
          <p className="hero-subtitle">{isLimited ? 'Travel essentials, clothing rentals, and Second Journey\u2122 services may be available with '+(city.deliveryLabel||'7-day advance')+' notice.' : 'Everything you need, delivered before you arrive. So you can travel lighter, experience more, and leave less behind.'}</p>
          {isLimited
            ? React.createElement('button',{className:'hero-cta',onClick:function(){setShowModal(true);setSubmitted(false);}},'Request Concierge Service \u2192')
            : React.createElement('a',{href:'/plan-my-trip.html',className:'hero-cta'},'Plan My Trip \u2192')
          }
        </div>
        <div className="hero-features">
          {features.map(function(f,i){
            return (
              <div key={i} className={'hero-feature' + (i < features.length-1 ? ' hero-feature--sep' : '')}>
                <span className="hero-feature-icon">{f.icon}</span>
                <span className="hero-feature-label">{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    showModal && React.createElement('div',{className:'crm-overlay',onClick:function(e){if(e.target.className==='crm-overlay')setShowModal(false);}},
      React.createElement('div',{className:'crm-modal'},
        React.createElement('div',{className:'crm-head'},
          React.createElement('div',null,
            React.createElement('div',{className:'crm-title'},'Request Concierge Service'),
            React.createElement('div',{className:'crm-sub'},city ? city.name + ' \u2014 ' + (city.deliveryLabel || '7-day advance') + ' notice' : '')
          ),
          React.createElement('button',{className:'crm-close',onClick:function(){setShowModal(false);},ariaLabel:'Close'},'\u2715')
        ),
        !submitted ? React.createElement('div',{className:'crm-body'},
          React.createElement('div',{className:'crm-field crm-full'},React.createElement('label',null,'City'),React.createElement('input',{readOnly:true,value:city?city.name:''})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Full name'),React.createElement('input',{id:'crm-name',placeholder:'Your name'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Phone'),React.createElement('input',{id:'crm-phone',placeholder:'+1 (000) 000-0000'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Email'),React.createElement('input',{id:'crm-email',type:'email',placeholder:'you@email.com'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Hotel name'),React.createElement('input',{id:'crm-hotel',placeholder:'Your hotel'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Arrival date'),React.createElement('input',{id:'crm-arrive',type:'date'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Departure date'),React.createElement('input',{id:'crm-depart',type:'date'})),
          React.createElement('div',{className:'crm-field'},React.createElement('label',null,'Clothing size'),
            React.createElement('select',{id:'crm-size'},['XS','S','M','L','XL','XXL'].map(function(s){return React.createElement('option',{key:s,value:s},s);}))),
          React.createElement('div',{className:'crm-field crm-full'},React.createElement('label',null,'What do you need?'),React.createElement('textarea',{id:'crm-items',placeholder:'Describe items or services you\'d like arranged\u2026',rows:3})),
          React.createElement('div',{className:'crm-note'},'BagFree Concierge will review your request and determine whether local fulfillment can be arranged. A response will be provided within 24 hours.'),
          React.createElement('button',{className:'crm-submit',onClick:function(){
            var d={city:city?city.name:'',full_name:document.getElementById('crm-name').value,phone:document.getElementById('crm-phone').value,email:document.getElementById('crm-email').value,hotel_name:document.getElementById('crm-hotel').value,arrival_date:document.getElementById('crm-arrive').value||null,departure_date:document.getElementById('crm-depart').value||null,clothing_size:document.getElementById('crm-size').value,requested_items:document.getElementById('crm-items').value,status:'pending',created_at:new Date().toISOString()};
            if(!d.email||!d.full_name){alert('Please provide your name and email.');return;}
            fetch('https://vkctidpaghpdlmleezvq.supabase.co/rest/v1/concierge_requests',{method:'POST',headers:{'Content-Type':'application/json','apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3RpZHBhZ2hwZGxtbGVlenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI5MjgsImV4cCI6MjA5MDg5ODkyOH0.wKtG6XD6CwLy3rJDZc4S10-NqNr3fcCXHYOWJt_C628','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3RpZHBhZ2hwZGxtbGVlenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI5MjgsImV4cCI6MjA5MDg5ODkyOH0.wKtG6XD6CwLy3rJDZc4S10-NqNr3fcCXHYOWJt_C628','Prefer':'return=minimal'},body:JSON.stringify(d)}).catch(function(){});
            setSubmitted(true);
          }},'Submit Request')
        ) : React.createElement('div',{className:'crm-success'},
          React.createElement('div',{className:'crm-check'},'\u2713'),
          React.createElement('p',null,'Thank you for your interest in BagFree ',city?city.name:'','. Our concierge team will review your request and confirm availability within 24 hours.'),
          React.createElement('button',{className:'crm-submit',onClick:function(){setShowModal(false);}},'Close')
        )
      )
    )
    ];
}

function AccessCards() {
  var cards = [
    { title:'Clothing', desc:'Select outfits delivered before you arrive.', link:'/departure-lounge-landing.html', img:'/clothing-card.png', cta:'Explore',
      icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('path',{d:'M12 2a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z'}),React.createElement('path',{d:'M12 6L2 12.5a1.5 1.5 0 001.6 2.54L12 10l8.4 5.04a1.5 1.5 0 001.6-2.54L12 6z'}),React.createElement('path',{d:'M5 18.5h14'})) },
    { title:'Curators', desc:'Local experts who help you experience the real city.', link:'/curators.html', img:'/curators-card.png', cta:'Meet a Curator',
      icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('path',{d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'}),React.createElement('circle',{cx:9,cy:7,r:4}),React.createElement('path',{d:'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'})) },
    { title:'Essentials', desc:'Hotel essentials and items you may have forgotten.', link:'/legacy.html#essentials', img:'/essentials-card.png', cta:'View Essentials',
      icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('rect',{x:2,y:7,width:20,height:14,rx:2}),React.createElement('path',{d:'M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2'}),React.createElement('line',{x1:12,y1:12,x2:12,y2:16}),React.createElement('line',{x1:10,y1:14,x2:14,y2:14})) },
    { title:'Second Journey™', desc:'Quality clothing, cleaned and prepared for its next traveler.', link:'/second-journey.html', img:'/second-journey-card.png', cta:'Learn More', teal:true,
      icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('path',{d:'M11 20A7 7 0 014 13c0-3.5 1.7-6.6 4.3-8.5C10.5 3 13 2 16 2c0 5-1 8-3 10-1.3 1.3-3 2-5 2'}),React.createElement('path',{d:'M11 20c4-1 7-4 9-9'})) },
  ];
  return (
    <section className="access-section">
      <div className="access-eyebrow">What You Can Access</div>
      <h2 className="access-title">Everything you need. Nothing you don't.</h2>
      <div className="access-grid">
        {cards.map(function(c,i){
          return (
            <a key={i} href={c.link} className={'access-card' + (c.teal ? ' access-card--teal' : '')}>
              <div className="access-card-img" style={{backgroundImage:'url('+c.img+')'}}>
                <div className={'access-card-icon' + (c.teal ? ' access-card-icon--teal' : '')}>{c.icon}</div>
              </div>
              <div className="access-card-body">
                <div className="access-card-title">{c.title}</div>
                <div className="access-card-desc">{c.desc}</div>
                <div className={'access-card-cta' + (c.teal ? ' access-card-cta--teal' : '')}>{c.cta} →</div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function NetworkSection(props) {
  var onCitySelect = props.onCitySelect || function(){};
  function selectCity(id){
    var c = CITIES.find(function(c){ return c.id === id; });
    if (c && !c.soon) onCitySelect(c);
  }
  var stats = [
    { val:'4',  lbl:'Cities Active',   icon:React.createElement('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('rect',{x:3,y:3,width:7,height:7}),React.createElement('rect',{x:14,y:3,width:7,height:7}),React.createElement('rect',{x:3,y:14,width:7,height:7}),React.createElement('rect',{x:14,y:14,width:7,height:7})) },
    { val:'18', lbl:'Hotels',          icon:React.createElement('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('rect',{x:2,y:3,width:20,height:14,rx:2}),React.createElement('path',{d:'M8 21V10m8 11V10M2 17h20'})) },
    { val:'27', lbl:'Curators',        icon:React.createElement('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('path',{d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'}),React.createElement('circle',{cx:9,cy:7,r:4}),React.createElement('path',{d:'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'})) },
    { val:'12', lbl:'Style Partners',  icon:React.createElement('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6},React.createElement('path',{d:'M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z'})) },
  ];

  var NET_CITIES = [
    {id:'savannah',  name:'Savannah',       state:'GA', type:'active',    delivery:'sameday', lat:32.0835,  lng:-81.0998},
    {id:'atlanta',   name:'Atlanta',        state:'GA', type:'active',    delivery:'sameday',   lat:33.749,   lng:-84.388},
    {id:'tampa',     name:'Tampa',          state:'FL', type:'active',    delivery:'sameday', lat:27.9506,  lng:-82.4572},
    {id:'orlando',   name:'Orlando',        state:'FL', type:'active',    delivery:'days3',   lat:28.5383,  lng:-81.3792},
    {id:'miami',     name:'Miami',          state:'FL', type:'soon',      delivery:'days3',   lat:25.7617,  lng:-80.1918},
    {id:'charleston',name:'Charleston',     state:'SC', type:'soon',      delivery:'days7',   lat:32.7765,  lng:-79.9311},
    {id:'nashville', name:'Nashville',      state:'TN', type:'soon',      delivery:'days7',   lat:36.1627,  lng:-86.7816},
    {id:'sandiego',  name:'San Diego',      state:'CA', type:'concierge', delivery:'days7',   lat:32.7157,  lng:-117.1611},
    {id:'seattle',   name:'Seattle',        state:'WA', type:'concierge', delivery:'days7',   lat:47.6062,  lng:-122.3321},
    {id:'denver',    name:'Denver',         state:'CO', type:'concierge', delivery:'days7',   lat:39.7392,  lng:-104.9903},
    {id:'phoenix',   name:'Phoenix',        state:'AZ', type:'concierge', delivery:'days7',   lat:33.4484,  lng:-112.074},
    {id:'losangeles',name:'Los Angeles',    state:'CA', type:'concierge', delivery:'days7',   lat:33.9425,  lng:-118.408},
    {id:'houston',   name:'Houston',        state:'TX', type:'concierge', delivery:'days7',   lat:29.7604,  lng:-95.3698},
    {id:'dallas',    name:'Dallas',         state:'TX', type:'concierge', delivery:'days7',   lat:32.7767,  lng:-96.797},
    {id:'chicago',   name:'Chicago',        state:'IL', type:'concierge', delivery:'days7',   lat:41.8781,  lng:-87.6298},
    {id:'saltlake',  name:'Salt Lake City', state:'UT', type:'concierge', delivery:'days7',   lat:40.7608,  lng:-111.891},
    {id:'columbus',  name:'Columbus',       state:'OH', type:'concierge', delivery:'days7',   lat:39.9612,  lng:-82.9988},
    {id:'newyork',   name:'New York',       state:'NY', type:'concierge', delivery:'days3',   lat:40.7128,  lng:-74.0060},
    {id:'washington',name:'Washington',     state:'DC', type:'concierge', delivery:'days3',   lat:38.9072,  lng:-77.0369},
  ];

  var NET_ROUTES = [['savannah','atlanta'],['atlanta','tampa'],['tampa','orlando']];
  var NET_COLOR = {sameday:'rgb(77,216,138)', days3:'#e8c06a', days7:'#a8b4cc'};
  var NET_DELIVERY_LABEL = {sameday:'Same-day · within 4 hrs', days3:'Under 3 days', days7:'7-day advance notice'};

  var [netTooltip, setNetTooltip] = React.useState(null);
  var [netTooltipPos, setNetTooltipPos] = React.useState({x:0,y:0});
  var [netMapData, setNetMapData] = React.useState(null);
  var svgRef = React.useRef(null);

  React.useEffect(function(){
    if(typeof d3==='undefined'||typeof topojson==='undefined') return;
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(function(us){
      setNetMapData(us);
    }).catch(function(){});
  },[]);

  React.useEffect(function(){
    if(!netMapData || !svgRef.current) return;
    var svg = svgRef.current;
    var container = svg.parentElement;
    if(!container || container.querySelector('.net-mag')) return;
    var ZOOM = 3;
    var SIZE = 180;
    var lens = document.createElement('div');
    lens.className = 'net-mag';
    lens.style.cssText = 'position:absolute;width:'+SIZE+'px;height:'+SIZE+'px;border:1.5px solid rgba(201,169,110,0.5);border-radius:4px;overflow:hidden;pointer-events:none;display:none;z-index:30;box-shadow:0 8px 20px rgba(0,0,0,0.15);background:rgba(248,246,240,0.98)';
    container.appendChild(lens);
    var clone = null;
    function refreshClone(){
      if(clone && clone.parentElement) clone.parentElement.removeChild(clone);
      clone = svg.cloneNode(true);
      clone.removeAttribute('id');
      clone.style.cssText = 'position:absolute;pointer-events:none';
      var r = svg.getBoundingClientRect();
      clone.style.width = (r.width * ZOOM) + 'px';
      clone.style.height = (r.height * ZOOM) + 'px';
      lens.appendChild(clone);
    }
    svg.addEventListener('mouseenter', function(){ refreshClone(); lens.style.display = 'block'; });
    svg.addEventListener('mousemove', function(e){
      var r = svg.getBoundingClientRect();
      var mx = e.clientX - r.left;
      var my = e.clientY - r.top;
      var lx = mx + 20; var ly = my - SIZE/2;
      if(lx + SIZE + 10 > container.clientWidth) lx = mx - SIZE - 20;
      if(ly < 0) ly = 5;
      if(ly + SIZE > container.clientHeight) ly = container.clientHeight - SIZE - 5;
      lens.style.left = lx + 'px';
      lens.style.top = ly + 'px';
      if(clone){
        clone.style.left = -(mx * ZOOM) + SIZE/2 + 'px';
        clone.style.top = -(my * ZOOM) + SIZE/2 + 'px';
      }
    });
    svg.addEventListener('mouseleave', function(){ lens.style.display = 'none'; });
  },[netMapData]);

  function getProj(){
    if(typeof d3==='undefined') return null;
    return d3.geoAlbersUsa().scale(1300).translate([487.5,305]);
  }

  function getPath(){
    var proj=getProj();
    if(!proj) return null;
    return d3.geoPath().projection(proj);
  }

  function handleMarkerHover(e, city){
    if(!svgRef.current) return;
    var rect = svgRef.current.getBoundingClientRect();
    var svgW = svgRef.current.clientWidth || rect.width;
    var svgH = svgRef.current.clientHeight || rect.height;
    var viewW=975, viewH=610;
    var proj=getProj(); if(!proj) return;
    var pt=proj([city.lng,city.lat]); if(!pt) return;
    var x=(pt[0]/viewW)*svgW; var y=(pt[1]/viewH)*svgH;
    setNetTooltipPos({x:x, y:y});
    setNetTooltip(city);
  }

  function renderNetMap(){
    if(typeof d3==='undefined'||typeof topojson==='undefined'||!netMapData) {
      return React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',height:'260px',color:'rgba(26,26,46,0.3)',fontSize:'0.8rem'}},'Loading map…');
    }
    var proj=getProj(); var pathFn=getPath();
    var features=topojson.feature(netMapData, netMapData.objects.states).features;
    var ROUTES_SVG=NET_ROUTES.map(function(pair,ri){
      var ca=NET_CITIES.find(function(c){return c.id===pair[0];});
      var cb=NET_CITIES.find(function(c){return c.id===pair[1];});
      var pa=proj([ca.lng,ca.lat]); var pb=proj([cb.lng,cb.lat]);
      if(!pa||!pb) return null;
      return React.createElement('line',{key:ri,x1:pa[0],y1:pa[1],x2:pb[0],y2:pb[1],stroke:'rgba(63,174,106,0.35)',strokeWidth:1.2,strokeDasharray:'4 4'});
    });
    var MARKERS=NET_CITIES.map(function(city,ci){
      var pt=proj([city.lng,city.lat]); if(!pt) return null;
      var isActive=city.type==='active';
      var isSameday=city.delivery==='sameday';
      var r=city.delivery==='sameday'?9:city.delivery==='days3'?8:7;
      var fill=NET_COLOR[city.delivery];
      return React.createElement('g',{key:ci,style:{cursor:'pointer'},
        onMouseEnter:function(e){handleMarkerHover(e,city);},
        onMouseLeave:function(){setNetTooltip(null);},
        onClick:function(){if(isActive)selectCity(city.id);}
      },
        isSameday&&React.createElement('circle',{cx:pt[0],cy:pt[1],r:14,fill:'none',stroke:'rgb(77,216,138)',strokeWidth:1.4,
          style:{animation:'gnRingPulse 2.4s ease-out infinite',transformOrigin:pt[0]+'px '+pt[1]+'px'}}),
        React.createElement('circle',{cx:pt[0],cy:pt[1],r:r,fill:fill,stroke:'rgba(248,246,240,0.8)',strokeWidth:1.5}),
        React.createElement('text',{x:pt[0],y:pt[1]-r-5,textAnchor:'middle',fontSize:10.5,fontWeight:600,fill:'rgb(26,26,46)',letterSpacing:'0.5',
          style:{paintOrder:'stroke',stroke:'#f8f6f0',strokeWidth:'3.5px',strokeLinejoin:'round',pointerEvents:'none'}},city.name)
      );
    });
    return React.createElement('div',{style:{position:'relative',width:'100%'}},
      React.createElement('svg',{ref:svgRef,viewBox:'0 0 975 610',style:{width:'100%',display:'block'},'aria-label':'BagFree US expansion network map'},
        React.createElement('g',null,
          features.map(function(f,i){
            return React.createElement('path',{key:i,d:pathFn(f),fill:'rgba(26,26,46,0.045)',stroke:'rgba(26,26,46,0.14)',strokeWidth:0.7});
          })
        ),
        React.createElement('g',null,ROUTES_SVG),
        React.createElement('g',null,MARKERS)
      ),
      netTooltip&&React.createElement('div',{style:{
        position:'absolute',left:netTooltipPos.x+12,top:Math.max(0,netTooltipPos.y-24),
        background:'rgb(26,26,46)',borderRadius:'8px',padding:'0.7rem 0.9rem',
        pointerEvents:'none',zIndex:10,minWidth:'160px',
        border:'1px solid rgba(201,169,110,0.25)',boxShadow:'0 8px 24px rgba(0,0,0,0.18)'
      }},
        React.createElement('div',{style:{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'0.95rem',color:'#e8e0d0',fontWeight:500}},netTooltip.name+', '+netTooltip.state),
        React.createElement('div',{style:{fontSize:'0.62rem',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:'0.2rem',
          color:netTooltip.delivery==='sameday'?'#c9a96e':netTooltip.delivery==='days3'?'rgb(93,202,165)':'rgba(232,224,208,0.5)',fontWeight:600}},
          NET_DELIVERY_LABEL[netTooltip.delivery]
        )
      )
    );
  }

  return (
    <section className="net-section">
      <div className="net-left">
        <div className="net-eyebrow">Growing Network</div>
        <h2 className="net-title">More cities.<br/>More partners.</h2>
        <div className="net-stats">
          {stats.map(function(s,i){
            return (
              <div key={i} className="net-stat">
                <div className="net-stat-icon">{s.icon}<span className="net-stat-val">{s.val}</span></div>
                <div className="net-stat-lbl">{s.lbl}</div>
              </div>
            );
          })}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.75rem',flexWrap:'wrap'}}>
          <span style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(26,26,46,0.45)'}}>
            <span style={{width:9,height:9,borderRadius:'50%',background:'rgb(77,216,138)',display:'inline-block',flexShrink:0}}></span>Same day
          </span>
          <span style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(26,26,46,0.45)'}}>
            <span style={{width:9,height:9,borderRadius:'50%',background:'rgb(232,192,106)',display:'inline-block',flexShrink:0}}></span>Under 3 days
          </span>
          <span style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(26,26,46,0.45)'}}>
            <span style={{width:9,height:9,borderRadius:'50%',background:'rgb(168,180,204)',display:'inline-block',flexShrink:0}}></span>7-day advance
          </span>
        </div>
        <a href="/expansion-map.html" className="net-btn">View Expansion Map →</a>
      </div>
      <div className="net-map" style={{position:'relative'}}>
        {renderNetMap()}
      </div>
    </section>
  );
}


function Testimonial() {
  return (
    <section className="testimonial-section">
      <div className="testimonial-text">
        <div className="testimonial-eyebrow">Trusted By Travelers</div>
        <blockquote className="testimonial-quote">"BagFree completely changed the way I travel. I packed lighter, explored more, and left a positive impact."</blockquote>
        <div className="testimonial-attr">— Jessica M., Atlanta</div>
        <div className="testimonial-dots">
          <span className="tdot tdot--active"></span>
          <span className="tdot"></span>
          <span className="tdot"></span>
        </div>
      </div>
      <div className="testimonial-photo">
        <img src="/testimonial-sunset.png" alt="Traveler enjoying sunset by the river" className="testimonial-photo-img"/>
        <div className="testimonial-photo-fade"></div>
      </div>
    </section>
  );
}

function HowItWorks() {
  var steps = [
    {
      n: '01',
      icon: React.createElement('svg', {width:26,height:26,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5},
        React.createElement('path',{d:'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'}),
        React.createElement('circle',{cx:12,cy:9,r:2.5})
      ),
      title: 'Choose Your Destination',
      desc: 'Select your city and travel dates. BagFree is live in Savannah, Tampa, and expanding soon.'
    },
    {
      n: '02',
      icon: React.createElement('svg', {width:26,height:26,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5},
        React.createElement('rect',{x:2,y:7,width:20,height:14,rx:2}),
        React.createElement('path',{d:'M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2'}),
        React.createElement('path',{d:'M8 12h8m-8 4h5'})
      ),
      title: 'Reserve What You Need',
      desc: 'Book clothing bundles, curated experiences, meals, and hotel essentials — all before you land.'
    },
    {
      n: '03',
      icon: React.createElement('svg', {width:26,height:26,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5},
        React.createElement('path',{d:'M22 11.08V12a10 10 0 11-5.93-9.14'}),
        React.createElement('polyline',{points:'22 4 12 14.01 9 11.01'})
      ),
      title: 'Arrive Prepared',
      desc: 'Everything is waiting at your hotel. Travel lighter, experience more, leave less behind.'
    }
  ];
  return (
    <div className="hiw-wrap">
      <div className="hiw-header">
        <div className="hiw-eyebrow">&#x2756; How It Works</div>
        <h2 className="hiw-title">Three steps to luggage-free travel.</h2>
      </div>
      <div className="hiw-steps">
        {steps.map(function(s, i) {
          return (
            <React.Fragment key={i}>
              <div className="hiw-step">
                <div className="hiw-step-top">
                  <div className="hiw-num">{s.n}</div>
                  <div className="hiw-icon">{s.icon}</div>
                </div>
                <div className="hiw-step-title">{s.title}</div>
                <div className="hiw-step-desc">{s.desc}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="hiw-connector">
                  <div className="hiw-line"></div>
                  <div className="hiw-arrow">&#xbb;</div>
                  <div className="hiw-line"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function TravelBanner() {
  var features = [
    { title:'Clothing Delivered', sub:'Before Arrival' },
    { title:'Local Experts &', sub:'Curated Experiences' },
    { title:'Sustainable', sub:'Second Journey\u2122 Fashion' },
    { title:'Rewards For', sub:'Traveling Lighter' },
    { title:'Everything Waiting', sub:'At Your Destination' }
  ];
  return (
    <div className="tb-wrap">
      <div className="tb-inner">
        <div className="tb-header">
          <div className="tb-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
          </div>
          <div className="tb-title">Travel Without The Baggage</div>
        </div>
        <div className="tb-features">
          {features.map(function(f, i) {
            return (
              <div key={i} className="tb-feat">
                <span className="tb-check">&#10003;</span>
                <div>
                  <div className="tb-feat-title">{f.title}</div>
                  <div className="tb-feat-sub">{f.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="tb-photo">
        <img src="/savannah-banner.png" alt="Savannah, Georgia" className="tb-photo-img"/>
        <div className="tb-photo-fade"></div>
      </div>
    </div>
  );
}

function QuoteSection() {
  return (
    <div className="why-bf-img-wrap">
      <img src="/why-bagfree.png" alt="Why BagFree — Travel Light, Experience More, Leave Less Behind" className="why-bf-img"/>
    </div>
  );
}

function VideoSection() {
  return (
    <section className="video-section">
      <div className="video-head">
        <span className="video-eyebrow">Watch</span>
        <h2 className="video-title">The BagFree story</h2>
      </div>
      <div className="video-frame">
        <iframe
          src="https://player.vimeo.com/video/1195690381?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="BagFree"
        />
      </div>
    </section>
  );
}

function SocialFooter() {
  var shareUrl = encodeURIComponent('https://bagfree.app');
  var shareText = encodeURIComponent('Travel Light. Experience More. Leave Less Behind. Check out BagFree — sustainable travel clothing delivered to your hotel. #BagFree #TravelLight');

  return (
    <div className="social-footer">
      <div className="social-footer-left">
        <span className="social-footer-brand">BagFree</span>
        <span className="social-footer-tagline">Travel Light. Experience More. Leave Less Behind.</span>
        <a href="tel:+18138162448" className="social-footer-phone">(813) 816-2448</a>
      </div>
      <div className="social-footer-right">
        <span className="social-footer-label">Share BagFree</span>
        <div className="social-footer-icons">
          <a href={'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareText} target="_blank" rel="noopener" className="social-icon" title="Share on X">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl} target="_blank" rel="noopener" className="social-icon" title="Share on Facebook">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl} target="_blank" rel="noopener" className="social-icon" title="Share on LinkedIn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href={'mailto:?subject=' + encodeURIComponent('Check out BagFree') + '&body=' + shareText + '%0A%0A' + shareUrl} className="social-icon" title="Share via Email">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          </a>
          <a href={'https://wa.me/?text=' + shareText + '%20' + shareUrl} target="_blank" rel="noopener" className="social-icon" title="Share on WhatsApp">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function RightRail(props) {
  const c = props.city;
  const cur = c.curator || {};
  return (
    <aside className="right-rail">
      {c.curator ? (
      <div className="widget">
        <div className="widget-label">Your Curator</div>
        <div className="curator-row">
          <div className="curator-avatar" style={{ backgroundImage:'url(' + cur.avatar + ')' }}></div>
          <div className="curator-info">
            <div className="curator-name">{cur.name}</div>
            <div className="curator-role">{cur.role}</div>
            <div className="curator-rating"><Icon.Star/> {cur.rating} <span>({cur.reviews})</span></div>
          </div>
        </div>
        <button className="btn-outline">View Profile</button>
      </div>
      ) : null}

      <div className="widget">
        <div className="widget-label">Your Trip</div>
        <div className="trip-row">
          <div>
            <div className="trip-dates">May 24 - May 27, 2025</div>
            <div className="trip-hotel">{c.hotel ? c.hotel + ', ' : ''}{c.name}</div>
          </div>
          <Icon.Calendar/>
        </div>
        <div className="trip-divider"></div>
        <div className="trip-orders">
          <div className="trip-orders-left">
            <div className="trip-orders-icon"><Icon.Package/></div>
            <div>
              <div className="trip-orders-text">3 Orders Confirmed</div>
              <a href="/departure-lounge-landing.html" className="link-gold" style={{ marginTop:'0.25rem' }}>View Orders <Icon.ArrowRight/></a>
            </div>
          </div>
        </div>
      </div>

      <div className="widget">
        <div className="widget-label">Refer &amp; Earn</div>
        <div className="refer-row">
          <div className="refer-left">
            <div className="refer-amount">Give $25, Get $25</div>
            <div className="refer-tag">Share BagFree with friends and earn rewards.</div>
            <a href="#refer" className="link-gold">Learn More <Icon.ArrowRight/></a>
          </div>
          <div className="refer-img"><Icon.GiftBox/></div>
        </div>
      </div>

      <div className="widget">
        <div className="widget-label">{c.name} Guide</div>
        <div className="guide-row">
          <div className="guide-left">
            <div className="guide-tag">Your curated guide to the best of {c.name}.</div>
            <a href="#guide" className="link-gold">View Guide <Icon.ArrowRight/></a>
          </div>
          <div className="guide-img">
            <div className="guide-img-label">{c.name.toUpperCase()}</div>
            <div className="guide-img-mini">GUIDE</div>
          </div>
        </div>
      </div>

      <div className="widget widget-network">
        <div className="widget-label" style={{color:'var(--gold)'}}>Join the Network</div>
        <div className="network-title">Help shape the future of travel.</div>
        <div className="network-desc">BagFree is building a network of curators, hotels, restaurants, delivery partners, and local businesses — all working together to help travelers arrive prepared, experience more, and leave less behind.</div>
        <div className="network-roles">
          <span className="network-role">Curator</span>
          <span className="network-role">Hotel</span>
          <span className="network-role">Delivery</span>
          <span className="network-role">Restaurant</span>
          <span className="network-role">Business</span>
          <span className="network-role">Sustainability</span>
        </div>
        <a href="/join-network.html" className="btn-network">Apply Now →</a>
      </div>
    </aside>
  );
}

function ConciergeChat(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const city = props.city;

  const msgsState = useState([]);
  const msgs = msgsState[0]; const setMsgs = msgsState[1];
  const inputState = useState('');
  const input = inputState[0]; const setInput = inputState[1];
  const busyState = useState(false);
  const busy = busyState[0]; const setBusy = busyState[1];
  const bodyRef = React.useRef(null);
  const seedHandled = React.useRef(false);

  // Auto-scroll to newest message
  React.useEffect(function(){
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy, open]);

  // Greeting on first open
  React.useEffect(function(){
    if (open && msgs.length === 0 && !props.seed) {
      setMsgs([{ role:'bot', text:'Hi! I\u2019m your BagFree concierge for ' + city.name + '. Ask me anything \u2014 what to pack, where to eat, things to do, or help with your order.' }]);
    }
  }, [open]);

  // If opened with a seed query (from a failed search), send it automatically
  React.useEffect(function(){
    if (open && props.seed && !seedHandled.current) {
      seedHandled.current = true;
      sendMessage(props.seed);
    }
    if (!open) seedHandled.current = false;
  }, [open, props.seed]);

  async function callConcierge(history) {
    const catalogSummary = SEARCHABLE.slice(0, 40).map(function(it){
      return '- ' + it.title + ' (' + (CATEGORIES[it.category] ? CATEGORIES[it.category].label : it.category) + ', ' + (it.city === 'all' ? 'all cities' : it.city) + ')';
    }).join('\n');
    const systemPrompt =
      'You are the BagFree concierge, a warm, concise travel assistant. BagFree delivers clothing rentals, meals, snacks, essentials, local experiences, and curator services to hotel guests in these cities: Savannah, Atlanta, Tampa, Orlando, and Miami. ' +
      'The guest is currently in ' + city.name + ', ' + (city.region || '') + '. ' +
      'Help with travel questions, recommendations, packing, and what BagFree offers. Keep replies short (2-4 sentences) and friendly. ' +
      'If asked about something outside the cities BagFree serves, gently note BagFree operates in the Southeast US but still try to be helpful. ' +
      'You cannot access real-time data (exact current time, live weather, flight status). If asked for those, say so briefly and suggest how they could check. ' +
      'When relevant, mention specific BagFree items from this catalog:\n' + catalogSummary;

    const apiMessages = history.map(function(m){
      return { role: m.role === 'user' ? 'user' : 'assistant', content: m.text };
    });

    const res = await fetch('/.netlify/functions/concierge-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, messages: apiMessages }),
    });
    const data = await res.json().catch(function(){ return {}; });
    if (!res.ok || !data.reply) {
      throw new Error((data && data.error) || ('Proxy HTTP ' + res.status));
    }
    return data.reply;
  }

  async function sendMessage(text) {
    const content = (text || input).trim().slice(0, 2000);  // cap to server limit
    if (!content || busy) return;
    track('concierge_message', { city: city.id });
    const userMsg = { role:'user', text: content };
    // Keep only the most recent turns so the request stays within server caps
    const nextMsgs = msgs.concat([userMsg]).slice(-18);
    setMsgs(nextMsgs);
    setInput('');
    setBusy(true);
    try {
      const reply = await callConcierge(nextMsgs);
      setMsgs(nextMsgs.concat([{ role:'bot', text: reply }]));
    } catch(e) {
      // Log the real failure reason so it shows in the browser console —
      // the chat bubble stays friendly, but this makes diagnosing
      // server/API issues possible without digging through Netlify logs.
      console.error('[ConciergeChat] request failed:', e && e.message ? e.message : e);
      setMsgs(nextMsgs.concat([{ role:'bot', text:'Sorry \u2014 I had trouble responding just now. Please try again in a moment.' }]));
    }
    setBusy(false);
  }

  function onKey(e){
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const starters = ['What should I pack?', 'Best dinner in ' + city.name + '?', 'Things to do nearby'];

  if (!open) {
    return (
      <button className="concierge" onClick={function(){ setOpen(true); track('concierge_open', { city: city.id }); }}>
        <Icon.Chat/> Concierge Chat
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-head">
        <div className="chat-head-avatar"><Icon.Chat/></div>
        <div className="chat-head-info">
          <div className="chat-head-title">BagFree Concierge</div>
          <div className="chat-head-sub"><span className="chat-head-dot"></span> Online · {city.name}</div>
        </div>
        <button className="chat-close" aria-label="Close chat" onClick={function(){ setOpen(false); }}><Icon.X/></button>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {msgs.map(function(m, i){
          return <div key={i} className={'chat-msg ' + (m.role === 'user' ? 'user' : 'bot')}>{m.text}</div>;
        })}
        {busy ? (
          <div className="chat-msg bot">
            <span className="chat-typing"><span></span><span></span><span></span></span>
          </div>
        ) : null}
        {msgs.length <= 1 && !busy ? (
          <div className="chat-suggest-row">
            {starters.map(function(s){
              return <button key={s} className="chat-chip" onClick={function(){ sendMessage(s); }}>{s}</button>;
            })}
          </div>
        ) : null}
      </div>

      <div className="chat-foot">
        <textarea className="chat-input" rows={1} maxLength={2000}
          placeholder="Message the concierge…"
          value={input}
          onChange={function(e){ setInput(e.target.value); }}
          onKeyDown={onKey}/>
        <button className="chat-send" disabled={busy || !input.trim()} onClick={function(){ sendMessage(); }} aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── AUTH & PROFILE ──
var SB_URL = 'https://vkctidpaghpdlmleezvq.supabase.co';
var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3RpZHBhZ2hwZGxtbGVlenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI5MjgsImV4cCI6MjA5MDg5ODkyOH0.wKtG6XD6CwLy3rJDZc4S10-NqNr3fcCXHYOWJt_C628';
var sbClient = null;
try { sbClient = window.supabase ? window.supabase.createClient(SB_URL, SB_KEY) : null; } catch(e) {}

function initAuth() {
  if (!sbClient) return;
  sbClient.auth.getSession().then(function(res) {
    if (res.data && res.data.session) {
      // User is logged in — hide sign-in button, load profile
      var signInBtn = document.getElementById('signInBtn');
      if (signInBtn) signInBtn.style.display = 'none';
      loadUserProfile(res.data.session.user);
    }
  });
}

function loadUserProfile(user) {
  sbClient.from('profiles').select('*').eq('id', user.id).single().then(function(res) {
    var p = res.data || {};
    var name = (p.first_name || user.email.split('@')[0]);
    var initial = name.charAt(0).toUpperCase();

    // Update avatar
    var avatarEl = document.getElementById('profileAvatar');
    if (p.avatar_url) {
      avatarEl.innerHTML = '<img class="profile-avatar-img" src="' + p.avatar_url + '" alt="">';
    } else {
      document.getElementById('profileInitial').textContent = initial;
    }

    // Update dropdown
    document.getElementById('ddName').textContent = (p.first_name || '') + ' ' + (p.last_name || '');
    document.getElementById('ddEmail').textContent = user.email;
    document.getElementById('ddBag').textContent = '$' + (p.bag_balance || 0).toFixed(2);

    // Load notifications (unread curator messages)
    sbClient.from('curator_messages').select('id', { count: 'exact' }).eq('user_id', user.id).eq('read', false).eq('direction', 'curator_to_user').then(function(msgRes) {
      var count = msgRes.count || 0;
      var badge = document.getElementById('notifBadge');
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = '';
      }
    }).catch(function(){});
  }).catch(function(){});
}

function toggleProfileDropdown(e) {
  e.stopPropagation();
  var dd = document.getElementById('profileDropdown');
  dd.classList.toggle('show');
}

function triggerAvatarUpload(e) {
  e.stopPropagation();
  document.getElementById('avatarFileInput').click();
  document.getElementById('profileDropdown').classList.remove('show');
}

function handleAvatarUpload(e) {
  var file = e.target.files && e.target.files[0];
  if (!file || !sbClient) return;

  // Validate
  if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }

  // Show uploading state
  var avatarEl = document.getElementById('profileAvatar');
  avatarEl.innerHTML = '<div class="profile-initial" style="font-size:0.55rem;letter-spacing:1px">...</div>';

  sbClient.auth.getSession().then(function(res) {
    if (!res.data || !res.data.session) { alert('Please sign in first.'); return; }
    var userId = res.data.session.user.id;
    var ext = file.name.split('.').pop();
    var path = 'avatars/' + userId + '.' + ext;

    // Upload to Supabase Storage (bucket: avatars)
    sbClient.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type }).then(function(uploadRes) {
      if (uploadRes.error) {
        console.error('Upload error:', uploadRes.error);
        // If bucket doesn't exist, show helpful message
        if (uploadRes.error.message && uploadRes.error.message.includes('not found')) {
          alert('Storage bucket "avatars" not found. Create it in Supabase Dashboard → Storage → New Bucket → Name: avatars → Public: ON');
        } else {
          alert('Upload failed: ' + uploadRes.error.message);
        }
        restoreDefaultAvatar(avatarEl);
        return;
      }

      // Get public URL
      var urlRes = sbClient.storage.from('avatars').getPublicUrl(path);
      var publicUrl = urlRes.data.publicUrl + '?t=' + Date.now(); // cache bust

      // Update profile
      sbClient.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId).then(function() {
        avatarEl.innerHTML = '<img class="profile-avatar-img" src="' + publicUrl + '" alt="Profile">';
      });
    });
  });
}

function restoreDefaultAvatar(el) {
  el.innerHTML = '<div class="profile-initial"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>';
}

function handleSignOut() {
  if (sbClient) {
    sbClient.auth.signOut().then(function() { window.location.reload(); });
  }
}

// Close dropdown on click outside
document.addEventListener('click', function(e) {
  var dd = document.getElementById('profileDropdown');
  if (dd && !e.target.closest('.profile-chip')) dd.classList.remove('show');
});

// Init auth on load
document.addEventListener('DOMContentLoaded', function() { setTimeout(initAuth, 100); });

function App() {
  const stateActive = useState('home');
  const active = stateActive[0];
  const setActive = stateActive[1];

  const initCity = (function(){
    // URL > localStorage > default
    try {
      const urlCity = new URLSearchParams(window.location.search).get('city');
      if (urlCity) {
        const c = CITIES.find(function(x){ return x.id === urlCity; });
        if (c && !c.soon) return c;
      }
      const saved = localStorage.getItem('bf_city');
      if (saved) {
        const c = CITIES.find(function(x){ return x.id === saved; });
        if (c && !c.soon) return c;
      }
    } catch(e) {}
    return CITIES[0];
  })();

  const stateCity = useState(initCity);
  const city = stateCity[0];
  const setCityState = stateCity[1];

  const searchState = useState({ query:'', results:null, expansion:null, aiHint:null });
  const search = searchState[0];
  const setSearch = searchState[1];

  const viewingState = useState(null);
  const rightOpenState = useState(function(){ try { return localStorage.getItem('bf_rr') === '1'; } catch(e){ return false; }});
  const rightOpen = rightOpenState[0];
  const setRightOpen = rightOpenState[1];
  function toggleRightRail() {
    var next = !rightOpen;
    setRightOpen(next);
    try { localStorage.setItem('bf_rr', next ? '1' : '0'); } catch(e){}
  }
  const viewing = viewingState[0];
  const setViewing = viewingState[1];

  const drawerState = useState(false);
  const drawerOpen = drawerState[0];
  const setDrawerOpen = drawerState[1];

  const chatOpenState = useState(false);
  const chatOpen = chatOpenState[0];
  const setChatOpen = chatOpenState[1];
  const chatSeedState = useState(null);
  const chatSeed = chatSeedState[0];
  const setChatSeed = chatSeedState[1];

  // Open the concierge chat, optionally seeding it with a question
  function askConcierge(seedText){
    setChatSeed(seedText || null);
    setChatOpen(true);
    track('concierge_open_from_search', { seed: seedText || null, city: cityRef.current.id });
  }

  // Ref so popstate (with stale closure) can read current city
  const cityRef = React.useRef(city);
  React.useEffect(function(){ cityRef.current = city; }, [city]);
  const searchQueryRef = React.useRef('');
  React.useEffect(function(){ searchQueryRef.current = search.query; }, [search.query]);

  // ── On mount: restore state from URL ───────────────────────────────────
  React.useEffect(function(){
    const url = readUrlState();
    if (url.q) {
      const ranked = rankResults(url.q, cityRef.current.id, SEARCHABLE);
      setSearch({ query: url.q, results: ranked, expansion: ranked.expansion || null, aiHint: null });
      track('search_restored_from_url', { q: url.q, city: cityRef.current.id });
    }
    if (url.view) {
      const item = SEARCHABLE.find(function(x){ return x.id === url.view; });
      if (item) setViewing(item);
    }
    // Normalize URL (e.g. strip stale params, ensure city present if search active)
    writeUrlState({
      q:    url.q || '',
      city: (url.q || url.view) ? cityRef.current.id : '',
      view: url.view || ''
    }, true);
  }, []);

  // ── Back / forward navigation ──────────────────────────────────────────
  React.useEffect(function(){
    function onPop(){
      const url = readUrlState();
      // City
      if (url.city) {
        const c = CITIES.find(function(x){ return x.id === url.city; });
        if (c && !c.soon && c.id !== cityRef.current.id) {
          try { localStorage.setItem('bf_city', c.id); } catch(e) {}
          setCityState(c);
        }
      }
      // Search
      if (url.q) {
        const ranked = rankResults(url.q, (url.city || cityRef.current.id), SEARCHABLE);
        setSearch({ query: url.q, results: ranked, expansion: ranked.expansion || null, aiHint: null });
      } else {
        setSearch({ query:'', results:null, expansion:null, aiHint:null });
      }
      // View
      if (url.view) {
        const item = SEARCHABLE.find(function(x){ return x.id === url.view; });
        setViewing(item || null);
      } else {
        setViewing(null);
      }
    }
    window.addEventListener('popstate', onPop);
    return function(){ window.removeEventListener('popstate', onPop); };
  }, []);

  function setCity(c) {
    if (c.soon) return;
    try { localStorage.setItem('bf_city', c.id); } catch(e) {}
    setCityState(c);
    if (search.results !== null && search.query) {
      track('search_recompute_city', { q: search.query, from: city.id, to: c.id });
      const reranked = rankResults(search.query, c.id, SEARCHABLE);
      setSearch({ query: search.query, results: reranked, expansion: reranked.expansion || null, aiHint: null });
      writeUrlState({ q: search.query, city: c.id, view: viewing ? viewing.id : '' }, true);
    } else if (readUrlState().city) {
      // Only persist city to URL if it was already there (avoid polluting the homepage URL)
      const url = readUrlState();
      writeUrlState({ q: url.q, city: c.id, view: url.view }, true);
    }
  }

  function onSearch(query, results, expansion, aiHint){
    setSearch({ query: query, results: results, expansion: expansion || null, aiHint: aiHint || null });
    setViewing(null);
    writeUrlState({ q: query, city: city.id }, false);  // push
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If the catalog had nothing, gently open the concierge after a beat so the
    // user sees the "no matches" message first, then the chat slides up seeded
    // with their question. Set AUTO_OPEN_CONCIERGE to false to require a click instead.
    var AUTO_OPEN_CONCIERGE = true;
    if (AUTO_OPEN_CONCIERGE && results && results.length === 0 && query && query.trim()) {
      setTimeout(function(){ askConcierge(query); }, 900);
    }
  }
  function clearSearch(){
    setSearch({ query:'', results:null, expansion:null, aiHint:null });
    setViewing(null);
    writeUrlState({}, false);  // push (so back returns to results)
    track('search_clear', {});
  }

  function openItem(item){
    track('result_view_detail', { id: item.id, category: item.category, platform: item.platform || null });
    setViewing(item);
    writeUrlState({
      q: searchQueryRef.current,
      city: city.id,
      view: item.id
    }, false);  // push (back returns to results)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function closeDetail(){
    setViewing(null);
    writeUrlState({
      q: searchQueryRef.current,
      city: searchQueryRef.current ? city.id : ''
    }, true);  // replace (no extra history entry)
  }

  return (
    <div className="app">
      <div className="mobile-bar">
        <button className="hamburger" aria-label="Open menu" onClick={function(){ setDrawerOpen(true); }}>
          <span></span><span></span><span></span>
        </button>
        <a href="/" className="brand-link"><img src={LOGO_SRC} alt="BagFree" className="brand-img--sm"/></a>
        <div className="mobile-bar-spacer"></div>
      </div>
      <div className={'drawer-overlay' + (drawerOpen ? ' show' : '')} onClick={function(){ setDrawerOpen(false); }}></div>
      <Sidebar mobileOpen={drawerOpen} onClose={function(){ setDrawerOpen(false); }} active={active} setActive={setActive} city={city} setCity={setCity}/>
      <main className="main">
        <TopBar city={city} setCity={setCity} onSearch={onSearch} onItemClick={openItem} onClearResults={clearSearch}/>
        {viewing ? (
          <ResultDetail item={viewing} onBack={closeDetail} onItemClick={openItem}/>
        ) : search.results === null ? (
          <React.Fragment>
            <Hero city={city}/>
            <HowItWorks/>
            <AccessCards/>
            <NetworkSection onCitySelect={setCity}/>
            <Testimonial/>
            <SocialFooter/>
          </React.Fragment>
        ) : (
          <SearchResults query={search.query} results={search.results} expansion={search.expansion} aiHint={search.aiHint} onClear={clearSearch} onItemClick={openItem} onAskConcierge={askConcierge}/>
        )}
      </main>
      <div className={'rr-outer' + (rightOpen ? ' rr-outer--open' : '')}>
        <button className="rr-toggle-tab" onClick={toggleRightRail} aria-label={rightOpen ? 'Close panel' : 'Open panel'} title={rightOpen ? 'Hide panel' : 'Show panel'}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {rightOpen
              ? React.createElement('polyline', {points:'9 18 15 12 9 6'})
              : React.createElement('polyline', {points:'15 18 9 12 15 6'})
            }
          </svg>
        </button>
        <RightRail city={city}/>
      </div>
      <ConciergeChat open={chatOpen} setOpen={setChatOpen} city={city} seed={chatSeed}/>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

// Show a "Connecting…" state while we fetch live data from Supabase
function renderApp(searchable) {
  if (searchable) {
    SEARCHABLE = searchable;
    console.log('[BagFree] Loaded ' + searchable.length + ' items from Supabase');
  } else {
    console.log('[BagFree] Using ' + SEED_SEARCHABLE.length + ' seed items');
  }
  ReactDOM.render(<App/>, rootEl);
}

// Fetch live content then render; if fetch takes >4s just render with seed data
const fetchTimeout = setTimeout(function(){ renderApp(null); }, 4000);
fetchSearchableContent().then(function(data) {
  clearTimeout(fetchTimeout);
  renderApp(data);
}).catch(function() {
  clearTimeout(fetchTimeout);
  renderApp(null);
});

// Hide loader once rendered
setTimeout(function(){
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hide');
    setTimeout(function(){ loader.remove(); }, 500);
  }
}, 100);

} catch (err) {
  const box = document.getElementById('err-box');
  if (box) {
    box.style.display = 'block';
    box.textContent = '[BABEL/RENDER ERROR] ' + (err.message || err);
  }
  console.error('Render error:', err);
}
