<template>
  <q-page v-if="theme" class="bg-page row justify-center q-py-md q-gutter-y-xl ">
    <div class="col-6">
      <q-card class="bg-swatch text-txtNormal justify-center">
        <q-card-section>
          <q-list max-width="600px">
            <template v-for="brand in getBrands(theme)">
              <q-item :key="brand">
                <q-item-section>
                  <q-card justify-center :class="handleBrand(brand)">
                    <q-card-section>
                      <div class="text-black" style="font-size: 25px" align="center">{{ brand }}
                        <q-icon name="colorize">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-color v-model="colorPick[brand]" :default-value="theme[brand]" />
                          </q-popup-proxy>
                        </q-icon>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn no-caps class="bg-button" label="Apply Theme" @click="handleSelect" />
        </q-card-actions>
      </q-card>
    </div>

  </q-page>
</template>  
<script>
import { mapGetters } from 'vuex'
import { colors } from 'quasar'

export default {
  name: 'Profile',
  data() {
    return {
      colorPick: {}
    }
  },
  computed: {
    ...mapGetters(['user', 'theme'])
  },
  methods: {
    getBrands(obj) {
      let brands = []
      Object.keys(obj).forEach((key) => {
        brands.push(key)
      })
      console.log('brands ' + brands)
      return brands
    },
    handleBrand(value) {
      return 'bg-' + value
    },
    handleSelect() {
      Object.keys(this.theme).forEach((key) => {
        if (this.colorPick[key]) this.theme[key] = this.colorPick[key]
      })
      this.$store.dispatch('saveTheme', {
        userId: this.user._id,
        theme: JSON.stringify(this.theme)
      })
    }
  }
}
</script>
<style lang="sass" scoped>

</style>