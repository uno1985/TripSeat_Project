// import PropTypes from 'prop-types'; //要檢查型別的話要安裝此套件

// data: array[{text(string), value(string)}]
// defaultValue: string
// placeholder: string
// className: string
// onChange: callback
function Selector({
    data=[],
    defaultValue='',
    placeholder='',
    className='',
    onChange=(e) => {},
    ...props}) {
    return (
        <>
        <select
            className={`form-select ${className}`}
            aria-label=""
            value={defaultValue}
            onChange={onChange}>
            {
                placeholder
                ? <option value={placeholder} key={"placeholder"}>{placeholder}</option>
                : null
            }
            {
                data.map((opt) => <option value={opt.value} key={opt.value}>{opt.text}</option>)
            }
        </select>
        </>
    );
}
export default Selector

// Selector.propTypes = {
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             text: PropTypes.string.isRequired,
//             value: PropTypes.string.isRequired
//     })).isRequired,
//     defaultValue: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.number
//     ]),
//     placeholder: PropTypes.string,
//     className: PropTypes.string,
//     onChange: PropTypes.func,
// };

