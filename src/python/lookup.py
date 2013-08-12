from nltk.corpus import wordnet as wn

def lookup_phrase(phrase):

    results = wn.synsets(phrase.replace('%20', '_'))  # replace space characters with underscores

    result = "[]" if len(results) == 0 else listify(results)

    return result

def listify(results):

    result_list = list()
    word_position = 0
    
    for result in results:

        current_word = dict()
        current_word['word'] = str(result.name.split('.', 1)[0]).replace('_', ' ')   # replace underscores with blank spaces
        current_word['part_of_speech'] = part_of_speech(result)
        current_word['definition'] = str(result.definition)
        
        word_position += 1
        result_list.append(current_word)

    result = " ,".join(map(str, result_list))

    result = "[" + result + "]"

    return result

def part_of_speech(syn):
    # Return the part of speech in words
    
    return {
        's': 'adjective',
        'a': 'adjective',
        'n': 'noun',
        'r': 'adverb',
        'v': 'verb'
    }.get(syn.pos, 'unknown')
