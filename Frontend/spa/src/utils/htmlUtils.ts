// HTML decoding utility for blog content
export function decodeHtml(htmlString: string): string {
  if (!htmlString) return "";

  // Create a temporary DOM element to decode HTML entities
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  // Return the decoded text as HTML (preserving HTML tags but decoding entities)
  return tempElement.innerHTML;
}

// Extract plain text from HTML for previews
export function stripHtml(htmlString: string): string {
  if (!htmlString) return "";

  // First decode HTML entities
  const decodedHtml = decodeHtml(htmlString);

  // Then extract plain text
  const tempElement = document.createElement("div");
  tempElement.innerHTML = decodedHtml;

  return tempElement.textContent || tempElement.innerText || "";
}

// Truncate text with proper word boundaries
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  // If we found a space and it's not too early in the string, cut at the space
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

// Get preview text from HTML content
export function getHtmlPreview(
  htmlContent: string,
  maxLength: number = 200
): string {
  const plainText = stripHtml(htmlContent);
  return truncateText(plainText, maxLength);
}
