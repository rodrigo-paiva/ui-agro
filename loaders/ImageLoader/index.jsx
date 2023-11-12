
import React from 'react'
import PropTypes from 'prop-types'

import { loadImage } from '../../util/image'
import { isPrerendering } from '../../util/prerender'

import errorImg from './error.svg'
import loadingImg from './loading.svg'
import placeholderImg from './placeholder.svg'

import styles from './ImageLoader.scss'

const defaultImageSize = 60

class ImageLoader extends React.Component {

    static propTypes = {
        src: PropTypes.string,
        loadingSrc: PropTypes.string,
        errorSrc: PropTypes.string,
        defaultSrc: PropTypes.string,
        defaultSize: PropTypes.number,
        asBackground: PropTypes.bool,
        disableDefault: PropTypes.bool,
        avoidMaxHeight: PropTypes.bool,
        handleProps: PropTypes.func,
    }

    state = {
        loading: !!this.props.src && !isPrerendering(),
        width: this.props.defaultSize || defaultImageSize,
        height: this.props.defaultSize || defaultImageSize,
    }

    componentDidMount() {

        if (!this.state.loading)
            return

        this.load(this.getImageUrl())

    }

    componentWillUnmount() {
        this.abortRequest()
    }

    componentDidUpdate(prevProps) {
        if (this.props.src !== prevProps.src)
            this.load(this.getImageUrl(this.props))
    }

    abortRequest() {
        if (this.imageRequest && this.imageRequest.abort)
            this.imageRequest.abort()
        this.imageRequest = null
    }

    load(imageUrl) {

        if (!this.state.loading || this.state.error) {
            this.setState({
                loading: true,
                error: null,
            })
        }

        this.abortRequest()

        this.imageRequest = loadImage(imageUrl)

        this.imageRequest
            .then(image => {
                this.setState({
                    loading: false,
                    width: image.width,
                    height: image.height,
                })
            })
            .catch(error => {
                if (error.isAborted)
                    return
                this.setState({
                    loading: false,
                    error: error,
                })
            })

    }

    getImageUrl(props) {
        const propsToUse = props || this.props
        const { src, defaultSrc, disableDefault } = propsToUse
        return src || (disableDefault ? '' : defaultSrc || placeholderImg)
    }

    getLoadingUrl(props) {
        const propsToUse = props || this.props
        const { loadingSrc } = propsToUse
        return loadingSrc || loadingImg
    }

    getErrorUrl(props) {
        const propsToUse = props || this.props
        const { errorSrc } = propsToUse
        return errorSrc || errorImg
    }

    handleImageProps(imgProps) {

        const {
            handleProps, // eslint-disable-line no-unused-vars
        } = this.props

        return handleProps ? handleProps(imgProps, this.state) : imgProps
    }

    render() {

        const {
            /* eslint-disable no-unused-vars */
            src,
            errorSrc,
            loadingSrc,
            defaultSrc,
            disableDefault,
            handleProps,
            /* eslint-enable no-unused-vars */
            defaultSize,
            asBackground,
            avoidMaxHeight,
            className,
            style = {},
            children,
            ...otherProps
        } = this.props

        const {
            loading,
            height,
            error,
        } = this.state

        const imageSrc = error ? this.getErrorUrl() : (loading ? this.getLoadingUrl() : this.getImageUrl())

        if (asBackground) {

            var bgImgStyles = {
                ...style,
            }

            if (imageSrc)
                bgImgStyles.backgroundImage = `url(${imageSrc})`

            var bgClassName = ''
            if (loading)
                bgClassName = styles.bgLoading
            else if (error)
                bgClassName = styles.bgError
            else
                bgClassName = styles.bgImg

            const bgImgProps = {
                className: `${bgClassName} ${className || ''}`,
                style: bgImgStyles,
                children: otherProps.dangerouslySetInnerHTML ? null : (children || <img src={imageSrc} className={styles.hiddenImg} />),
                ...otherProps
            }

            return <span {...this.handleImageProps(bgImgProps)} />
        }

        delete otherProps.dangerouslySetInnerHTML

        var imgStyles = {
            ...style,
        }

        if (!avoidMaxHeight || loading)
            imgStyles.maxHeight = `${height || defaultSize || defaultImageSize}px`

        var imgClassName = ''
        if (loading)
            imgClassName = styles.loading
        else if (error)
            imgClassName = styles.error
        else
            imgClassName = styles.img

        const imgProps = {
            className: `${imgClassName} ${className || ''}`,
            style: imgStyles,
            src: imageSrc,
            ...otherProps
        }

        return <img {...this.handleImageProps(imgProps)} />
    }

}

export default ImageLoader
