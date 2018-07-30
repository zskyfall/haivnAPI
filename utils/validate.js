const TEXT_BLANK = '';
const NUMB_THREE = 3;

function validate(content) {
	if(content != TEXT_BLANK && content != undefined && content.length > NUMB_THREE) {
		return true;
	}

	return false;
}

module.exports = validate;