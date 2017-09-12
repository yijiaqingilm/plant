<template>
    <div class="image-upload">
        <img :src="src" id="image" class="file-img" :style="imgStyle" alt="">
        <input type="file" @change="change" :id="id" class="input-file" accept="image/*">
    </div>
</template>

<script type="text/ecmascript-6">
    import loadImage from 'lib/loadImage'
    import {compose, toLower, last, split} from "ramda";
    import {common} from 'lib/common'
    import {commonly} from 'lib/utils'
    export default {
        props: {
            multiple: {
                type: String,
                default: ''
            },
            id: {
                type: String,
            },
            defaultSrc: {
                type: null,
                default: ''
            },
            imgStyle: {
                type: null,
            }
        },
        data(){
            return {
                files: [],
                src: require('./default.png')
            }
        }, created(){
            if (this.defaultSrc != '') {
                this.src = this.defaultSrc;
            }
        }, mounted(){

        },
        computed: {},
        methods: {
            checkFiles(files){
                const suffix_rule = ['jpg', 'jpeg', 'png', 'gif']
                let suffix = compose(toLower, last, split('.'));
                for (let i = 0; i < files.length; i++) {
                    let file_typename = suffix(files[i].name);
                    if (suffix_rule.indexOf(file_typename) === -1) {
                        return false;
                    }
                }
                return true;
            },
            upload(file){
                loadImage.parseMetaData(
                    file,
                    (data) => {
                        var ori = 1;
                        if (data.exif && data.exif.get("Orientation")) {
                            ori = data.exif.get("Orientation");
                        }
                        loadImage(file, cv => {
                            this.src = cv.toDataURL('image/jpeg', 0.6);
                            this.$emit("getBlob", common.base64ToBlob(...this.src.split(',')));


                        }, {
                            canvas: true,
                            orientation: ori
                        })

                    },
                    {
                        maxMetaDataSize: 262144,
                        disableImageHead: false
                    }
                );
            },
            change(e){
                this.files = e.target.files;
                if (this.checkFiles(this.files)) {
                    this.upload(this.files[0])
                }
            }

        },
        watch: {
            defaultSrc: {
                handler(curVal, oldVal){
                    this.src = curVal;
                },
            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myImageUpload.scss";
</style>
