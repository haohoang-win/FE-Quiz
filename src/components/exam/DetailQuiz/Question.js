import _ from 'lodash'
import { useState } from 'react';
import Lightbox from "react-awesome-lightbox";
import { useTranslation, Trans } from 'react-i18next';

const Question = (props) => {
    const { t } = useTranslation();
    const { data, index } = props;

    const [isPreviewImage, setIsPreviewImage] = useState(false)

    if (_.isEmpty(data)) {
        return (
            <></>
        )
    }

    const handleCheckbox = (event, aId, qId) => {
        // console.log('data: ', data, id);
        props.handleCheckbox(aId, qId)
    }

    return (
        <>

            {data.image ?
                <div className='q-image'>
                    <img
                        style={{ cursor: 'pointer' }}
                        src={`data:image/jpeg;base64,${data.image}`}
                        onClick={() => setIsPreviewImage(true)}
                    />
                    {isPreviewImage === true &&
                        <Lightbox
                            image={`data:image/jpeg;base64,${data.image}`}
                            title={"Question Image"}
                            onClose={() => setIsPreviewImage(false)}
                        >
                        </Lightbox>
                    }
                </div>
                :
                <div className='q-image'></div>
            }
            <div className="question">{t('question.questions')} {index + 1}: {data.questionDescription}</div>
            <div className="answer">
                {data.answer && data.answer.length &&
                    data.answer.map((a, index) => {
                        return (
                            <div className="a-child" key={`answer-${index}`}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={a.isSelected}
                                        value=""
                                        onChange={(event) => handleCheckbox(event, a.id, data.questionsId)}
                                    />
                                    <label className="form-check-label">
                                        {a.description}
                                    </label>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Question;