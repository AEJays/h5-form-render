<template>
    <view>
        <dynamic-list :config="config" v-if="config.loadApi" />
    </view>
</template>

<script>
    import dynamicList from '@/components/dynamic-list/index.vue'
    import { getDynamicListField } from '@/common/api.js'
	import _ from 'lodash'
    export default {
        components: { dynamicList },
        data() {
            return {
				config: {}
            }
        },
        onLoad() {
            this.fetchData()
        },
        methods: {
            async fetchData () {
            	const res = await getDynamicListField({ id: 100 })
            	if (_.get(res, 'code') === 200) {
            		this.config = _.cloneDeep(_.get(res, 'data', {}))
                    this.config.outStyle = {
                        // height: '240px'
                    }
            	}
            }
        }
    }
</script>

<style>
    
</style>
