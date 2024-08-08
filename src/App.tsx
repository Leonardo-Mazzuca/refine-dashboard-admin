import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {  useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import {Home,ForgotPassword,Login,Register, CompanyList} from './pages'

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import {authProvider, dataProvider,liveProvider} from './providers'
import Layout from "./components/layout";
import { resources } from "./config/recources";
import Create from "./pages/company/create";
import EditPage from "./pages/company/edit";
import TaskList from "./pages/tasks/list";
import TasksCreate from "./pages/tasks/create";
import TaskEdit from "./pages/tasks/edit";

function App() {
  return (
    <BrowserRouter>
      
      <RefineKbarProvider>
       
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "9Ic6Of-1wJnxH-bJuix8",
                  liveMode: "auto",
                }}
              >
                <Routes>
                
                  
                  <Route path="login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    element={
                    <Authenticated 
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                     >
                      <Layout>
                        <Outlet />
                      </Layout>

                     </Authenticated>}
                  >

                      <Route index element={<Home />} />
                      <Route path="/companies" >
                        <Route index element={<CompanyList />} />
                        <Route path="new" element={<Create />} />
                        <Route path="edit/:id" element={<EditPage />} />
                      </Route>
                      <Route path="/tasks" element={
                          <TaskList >

                          <Outlet
                          
                          />
                        
                        </TaskList>
                      }
                      >
                        <Route path="new" element={<TasksCreate/>} />
                        <Route path="edit/:id" element={<TaskEdit/>} />
                      </Route>
                     
                     
                        
                     
                     

                  </Route>

            
                 
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>

      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
