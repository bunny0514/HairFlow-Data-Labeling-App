# HairFlow Data Labeling App

A web application for labeling hair images with detailed measurements and characteristics. This app helps build a training dataset for AI models that can identify and generate historically underrepresented hair types.

## Features

- **Interactive Quiz Form**: Label hair images with measurements including curl radius, wavelength, twist frequency, porosity, and thickness
- **Express.js Backend**: RESTful API for saving labeled data
- **JSONL Data Storage**: Labels are saved in JSONL format (one JSON object per line) in `data/labels.jsonl`
- **Static File Serving**: Serves HTML pages, images, and stylesheets

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bunny0514/HairFlow-Data-Labeling-App.git
   cd HairFlow-Data-Labeling-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the Express server:
```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified by the `PORT` environment variable).

## Usage

1. **Home Page**: Visit `http://localhost:3000` (redirects to home page)
2. **Training Page**: Visit `http://localhost:3000/pages/training.html` to learn about the labeling taxonomy
3. **Quiz/Labeling Form**: Visit `http://localhost:3000/pages/quiz.html` to label hair images

### Labeling a Hair Image

1. Fill in the required metadata:
   - **Image ID**: Identifier for the image (e.g., `img_0042.jpg`)
   - **Labeler ID**: Automatically generated, but can be edited
   - **Round**: Labeling round number

2. Adjust the measurement sliders:
   - **Curl Radius** (cm): 0-10
   - **Twist Frequency** (score): 1-10
   - **Curl Wavelength** (cm): 0-10
   - **Porosity** (score): 1-10
   - **Thickness** (score): 1-10

3. Optionally:
   - Mark the image as ambiguous if uncertain
   - Add comments or notes

4. Click **Submit** to save the label

The label will be saved to `data/labels.jsonl` in the following format:

```json
{
  "image_id": "img_0042.jpg",
  "labeler_id": "anon_72h8f3",
  "created_at": "2025-11-06T19:38:20Z",
  "round": 1,
  "measurements": {
    "radius_cm": 2.3,
    "wavelength_cm": 5.1,
    "twist_frequency_score": 7,
    "porosity_score": 5,
    "thickness_score": 8
  },
  "flags": {
    "is_ambiguous": true,
    "comments": "Between 3C and 4A",
    "review_status": "pending"
  }
}
```

## API Endpoints

### `GET /api/health`
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### `POST /api/labels`
Submit a new label for a hair image.

**Request Body:**
```json
{
  "image_id": "string (required)",
  "labeler_id": "string (required)",
  "created_at": "ISO 8601 timestamp (optional, auto-generated if not provided)",
  "round": "number (required)",
  "measurements": {
    "radius_cm": "number (required)",
    "wavelength_cm": "number (required)",
    "twist_frequency_score": "number (required)",
    "porosity_score": "number (required)",
    "thickness_score": "number (required)"
  },
  "flags": {
    "is_ambiguous": "boolean (optional)",
    "comments": "string (optional)",
    "review_status": "string (optional, defaults to 'pending')"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Label saved successfully",
  "record": { /* the saved record */ }
}
```

## Project Structure

```
HairFlow-Data-Labeling-App/
├── server.js              # Express.js backend server
├── package.json           # Node.js dependencies and scripts
├── .gitignore            # Git ignore rules
├── data/
│   └── labels.jsonl      # Labeled data (one JSON object per line)
├── pages/
│   ├── index.html        # Home page
│   ├── quiz.html         # Labeling quiz form
│   └── training.html     # Training/taxonomy guide
├── images/               # Hair image samples
└── styles.css            # Application styles
```

## Data Storage

Labels are stored in `data/labels.jsonl` using the JSONL (JSON Lines) format. Each line contains a complete JSON object representing one labeled image. This format is:
- Easy to append to (new labels are added line by line)
- Easy to parse (one line = one record)
- Human-readable
- Efficient for large datasets

To view your labels:
```bash
cat data/labels.jsonl
```

To format and view:
```bash
cat data/labels.jsonl | python3 -m json.tool
```

## Development

### Dependencies
- **Express.js**: Web framework for Node.js
- See `package.json` for complete dependency list

### Environment Variables
- `PORT`: Server port (default: 3000)

## Contributing

This project is part of the HairFlow research initiative. For questions, contact the project leader at sjobalia@stanford.edu.

## License

ISC
