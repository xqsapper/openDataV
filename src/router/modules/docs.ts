import ReadMe from '@/docs/tutorial/Home.md'
import { NothingLayout } from '@/layout'
import { ComponentGroupList } from '@/enum'
import type { GroupType } from '@/enum'
import type { ComponentItem } from '@/types/component'
import { camel2snake } from '@/utils/utils'

const getComponents = () => {
  const componentDocs: Array<ComponentItem> = ComponentGroupList.map((el: GroupType) => {
    return {
      label: el.name,
      key: el.key,
      icon: el.icon,
      children: []
    }
  })
  const moduleFilesTs: any = import.meta.glob('../../resource/components/**/index.ts', {
    eager: true
  })
  Object.keys(moduleFilesTs).forEach((key: string) => {
    const componentOptions = moduleFilesTs[key]?.default
    const componentInstance = new componentOptions.config()
    const docs = componentDocs.filter((el) => el.key === componentInstance.group)
    if (docs.length > 0) {
      docs[0].children.push({
        key: componentInstance.component,
        label: componentInstance.name,
        docs: componentOptions.docs
          ? componentOptions.docs
          : () => import('@/docs/Content/Empty.vue')
      })
    }
  })
  return componentDocs.map((ele) => {
    return {
      path: ele.key.toLocaleLowerCase(),
      name: ele.key,
      component: NothingLayout,
      meta: {
        title: ele.label,
        icon: ele.icon,
        ignoreAuth: true,
        hideInMenu: true
      },
      children: ele.children.map((el) => {
        return {
          path: camel2snake(el.key),
          name: el.key,
          component: el.docs,
          meta: {
            title: el.label,
            ignoreAuth: true,
            hideInMenu: true
          }
        }
      })
    }
  })
}

const basicRoutes = [
  {
    path: '/docs',
    name: 'Docs',
    component: () => import('@/docs/Site.vue'),
    redirect: '/docs/quick-satrt/intro',
    meta: {
      title: '文档',
      icon: 'docs',
      ignoreAuth: true,
      hideInMenu: true
    },
    children: [
      {
        path: '/docs/quick-satrt',
        name: 'Designer',
        component: () => import('@/docs/Content/Content.vue'),
        redirect: '/docs/quick-satrt/intro',
        meta: {
          title: '快速开始',
          icon: 'QuickStart',
          ignoreAuth: true,
          hideInMenu: true
        },
        children: [
          {
            path: 'intro',
            name: 'Intro',
            component: () => import('@/docs/tutorial/Home.md'),
            meta: {
              title: '介绍',
              icon: 'helpcenter',
              ignoreAuth: true,
              hideInMenu: true
            }
          },
          {
            path: 'quick-start',
            name: 'QuickStart',
            component: () => import('@/docs/tutorial/QuickStart.md'),
            meta: {
              title: '快速开始',
              icon: 'helpcenter',
              ignoreAuth: true,
              hideInMenu: true
            }
          }
        ]
      },
      {
        path: '/docs/component',
        name: 'Component',
        component: () => import('@/docs/Content/Content.vue'),
        meta: {
          title: '组件',
          icon: 'components'
        },
        redirect: '/docs/component/text/static-text',
        children: [...getComponents()]
      },
      {
        path: '/docs/data',
        name: 'Data',
        component: ReadMe,
        meta: {
          title: '数据',
          icon: 'data'
        }
      }
    ]
  }
]

export default basicRoutes
