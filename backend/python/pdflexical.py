import sys
import io
import language_tool_python
import pdfplumber
import json

def analyze_pdf_document(pdf_data):
    tool = language_tool_python.LanguageTool('en-US')

    # Read the document content
    with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
        document_content = ' '.join(page.extract_text() for page in pdf.pages)

    # Calculate total number of words in the document
    total_words = len(document_content.split())

    # Perform spelling and grammar check
    matches = tool.check(document_content)

    # Get the number of spelling errors
    spelling_errors = [match for match in matches if match.ruleId == 'MORFOLOGIK_RULE_EN_US']

    # Get the number of grammar errors
    grammar_errors = [match for match in matches if match.ruleId != 'MORFOLOGIK_RULE_EN_US']

    # Calculate and return the percentage of spelling and grammar errors
    spelling_error_percentage = (len(spelling_errors) / total_words) * 100
    grammar_error_percentage = (len(grammar_errors) / total_words) * 100

    return spelling_error_percentage, grammar_error_percentage

# Use the function
pdf_data = sys.stdin.buffer.read()  # Read the PDF data from stdin
spelling_error_percentage, grammar_error_percentage = analyze_pdf_document(pdf_data)

# Print the results as a JSON string
print(json.dumps({
    'spelling': spelling_error_percentage,
    'grammar': grammar_error_percentage,
}))