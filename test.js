import { AutoTokenizer, AutoModelForSequenceClassification } from '@xenova/transformers';

const model_id = 'mixedbread-ai/mxbai-rerank-xsmall-v1';
const model = await AutoModelForSequenceClassification.from_pretrained(model_id);
const tokenizer = await AutoTokenizer.from_pretrained(model_id);

/**
 * Performs ranking with the CrossEncoder on the given query and documents. Returns a sorted list with the document indices and scores.
 * @param {string} query A single query
 * @param {string[]} documents A list of documents
 * @param {Object} options Options for ranking
 * @param {number} [options.top_k=undefined] Return the top-k documents. If undefined, all documents are returned.
 * @param {number} [options.return_documents=false] If true, also returns the documents. If false, only returns the indices and scores.
 */
async function rank(query, documents, { top_k = undefined, return_documents = false } = {}) {
	const inputs = tokenizer(new Array(documents.length).fill(query), {
		text_pair: documents,
		padding: true,
		truncation: true
	});
	const { logits } = await model(inputs);
	return logits
		.sigmoid()
		.tolist()
		.map(([score], i) => ({
			corpus_id: i,
			score,
			...(return_documents ? { text: documents[i] } : {})
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, top_k);
}

// Example usage:
const query = "Who wrote 'Moby-Dik'?";
const documents = [
	`The University of the West Indies (UWI) is a regional and
international institution primarily serving the needs of the
Commonwealth Caribbean. Established in 1948 at Mona,
Jamaica, as a college in special relationship with the University
of London, it received full university status in 1962, as an
independent degree granting institution. In 1960, a second
campus was established at St Augustine, Trinidad, and in 1963
teaching started in Barbados, first at a temporary site at the
Bridgetown Port and then at the Cave Hill Campus. Sciences
have been taught at the Cave Hill Campus of the University of the
West Indies from its inception. The Faculty was formerly known
as the Faculty of Natural Sciences and later the Faculty of Pure
and Applied Sciences before deciding that the name Faculty of
Science and Technology (FST) best represented the degrees
being offered. Our full-time academic staff are mainly Caribbean
nationals, but we are also very much an international Faculty
with about one third of our lecturers drawn from countries far
and wide. Our degree programmes are well-respected regionally
and internationally with many of our graduates working or
pursuing further studies overseas.`
];

const results = await rank(query, documents, { return_documents: true, top_k: 3 });
console.log(results[0].text);
